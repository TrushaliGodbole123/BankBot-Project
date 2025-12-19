from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.pool import SimpleConnectionPool
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import requests
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)

SECRET_KEY = "TRUSHALI_SECRET_KEY"
load_dotenv()  # Load variables from .env
# ---------------------------------------
# POSTGRES CONNECTION POOL
# ---------------------------------------
DB_POOL = SimpleConnectionPool(
    1, 20,
    host=os.getenv("DB_HOST"),
    database=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD")
)

def get_conn():
    return DB_POOL.getconn()

def release_conn(conn):
    DB_POOL.putconn(conn)

# ---------------------------------------
# RASA ENDPOINTS
# ---------------------------------------
RASA_PARSE = "http://localhost:5005/model/parse"
RASA_URL   = "http://localhost:5005/webhooks/rest/webhook"

# ---------------------------------------
# SAVE USER LOG
# ---------------------------------------
def save_faq(user_message, intent, bot_reply, user_email=None):
    try:
        conn = get_conn()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO faq_logs (user_message, predicted_intent, bot_reply, user_email)
            VALUES (%s, %s, %s, %s)
        """, (user_message, intent, bot_reply, user_email))

        conn.commit()
        cur.close()
        release_conn(conn)

    except Exception as e:
        print("DB Error:", e)




# -------------------------------
# USER SIGNUP (Save in Database)
# -------------------------------
@app.post("/user/signup")
def user_signup():
    data = request.json
    username = data["username"]
    email = data["email"]
    password = data["password"]

    hashed_pw = generate_password_hash(password)

    try:
        conn = get_conn()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO users (username, email, password_hash)
            VALUES (%s, %s, %s)
        """, (username, email, hashed_pw))

        conn.commit()
        cur.close()
        release_conn(conn)

        return jsonify({"success": True, "message": "Signup successful"})

    except Exception as e:
        print("Signup Error:", e)
        return jsonify({"success": False, "message": "Email already exists"})



# -------------------------------
# USER LOGIN (Check DB)
# -------------------------------
@app.post("/user/login")
def user_login():
    data = request.json
    email = data["email"]
    password = data["password"]

    conn = get_conn()
    cur = conn.cursor()

    cur.execute("SELECT id, password_hash FROM users WHERE email=%s", (email,))
    user = cur.fetchone()

    cur.close()
    release_conn(conn)

    if not user:
        return jsonify({"success": False, "message": "User not found"})

    user_id, password_hash = user

    if not check_password_hash(password_hash, password):
        return jsonify({"success": False, "message": "Invalid password"})

    return jsonify({"success": True, "user_id": user_id})

# -------------------------------
# ADMIN LOGIN (Plain Text Password)
# -------------------------------
# ---- ADMIN LOGIN ----
@app.post("/admin/login")
def admin_login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    conn = get_conn()
    cur = conn.cursor()

    cur.execute("SELECT id, password FROM admins WHERE email=%s", (email,))
    admin = cur.fetchone()

    cur.close()
    release_conn(conn)

    if not admin:
        return jsonify({"success": False, "message": "Invalid credentials"})

    stored_password = admin[1]

    if password != stored_password:
        return jsonify({"success": False, "message": "Invalid credentials"})

    return jsonify({"success": True, "message": "Login successful"})

#intent add 
@app.get("/admin/intents")
def get_intents():
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("SELECT id, intent_name, examples FROM intents")
    rows = cur.fetchall()

    cur.close()
    release_conn(conn)

    return jsonify([
        {"id": r[0], "intent_name": r[1], "examples": r[2]}
        for r in rows
    ])

# ---------------------------------------------------
# 3. ADMIN — ADD INTENT
# ---------------------------------------------------
@app.post("/admin/intent/add")
def add_intent():
    data = request.json
    intent_name = data["intent_name"]
    examples = "\n".join(data["examples"])

    conn = get_conn()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO intents (intent_name, examples)
        VALUES (%s, %s)
        RETURNING id
    """, (intent_name, examples))

    conn.commit()
    cur.close()
    release_conn(conn)

    return jsonify({"success": True, "message": "Intent added successfully"})

# ---------------------------------------------------
# 4. ADMIN — EDIT INTENT
# ---------------------------------------------------
@app.put("/admin/intent/edit/<int:id>")
def edit_intent(id):
    data = request.json
    intent_name = data["intent_name"]
    examples = "\n".join(data["examples"])

    conn = get_conn()
    cur = conn.cursor()

    cur.execute("""
        UPDATE intents 
        SET intent_name=%s, examples=%s 
        WHERE id=%s
    """, (intent_name, examples, id))

    conn.commit()
    cur.close()
    release_conn(conn)

    return jsonify({"success": True, "message": "Intent updated successfully"})

# ---------------------------------------------------
# 5. ADMIN — DELETE INTENT
# ---------------------------------------------------
@app.delete("/admin/intent/delete/<int:id>")
def delete_intent(id):
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("DELETE FROM intents WHERE id=%s", (id,))

    conn.commit()
    cur.close()
    release_conn(conn)

    return jsonify({"success": True, "message": "Intent deleted successfully"})



#admin user 

@app.get("/admin/users")
def get_users():
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("""
        SELECT username, email, created_at
        FROM users
        ORDER BY created_at DESC
    """)

    rows = cur.fetchall()
    cur.close()
    release_conn(conn)

    return jsonify([
        {
            "username": r[0],
            "email": r[1],
            "created_at": str(r[2])
        }
        for r in rows
    ])


# ---------------------------------------------------
# 6. ADMIN — VIEW LAST 24 HOURS LOGS
# ---------------------------------------------------

@app.get("/admin/logs")
def get_last_24_hours_logs():
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("""
        SELECT user_email, user_message, bot_reply, created_at
        FROM faq_logs
        WHERE created_at >= NOW() - INTERVAL '24 HOURS'
        ORDER BY created_at DESC
    """)

    rows = cur.fetchall()
    cur.close()
    release_conn(conn)

    return jsonify([
        {
            "user_email": r[0],
            "user_message": r[1],
            "bot_reply": r[2],
            "created_at": str(r[3]),
        }
        for r in rows
    ])



# ---------------------------------------------------
# 7. CHAT ENDPOINT (SAME AS YOUR OLD ONE)
# ---------------------------------------------------
@app.post("/chat")
def chat():
    data = request.json
    user_msg = data.get("message", "")
    user_email = data.get("user_email")   
    print("📥 RECEIVED EMAIL:", user_email)

    # 1️⃣ GET INTENT
    try:
        intent_res = requests.post(
            RASA_PARSE,
            json={"text": user_msg},
            timeout=15
        ).json()
        intent = intent_res.get("intent", {}).get("name", "unknown")
    except:
        intent = "unknown"

    # 2️⃣ BOT REPLY
    try:
        rasa_res = requests.post(
            RASA_URL,
            json={"sender": "user", "message": user_msg},
            timeout=15
        ).json()

        bot_replies = [msg.get("text") for msg in rasa_res if msg.get("text")]
        bot_reply = bot_replies[0] if bot_replies else "I did not understand."

    except:
        bot_replies = ["Rasa not reachable"]
        bot_reply = "Rasa not reachable"

    # save_faq(user_msg, intent, bot_reply)
    save_faq(user_msg, intent, bot_reply, user_email)


    return jsonify({"responses": bot_replies, "intent": intent})

# ---------------------------------------------------
# RUN SERVER
# ---------------------------------------------------
if __name__ == "__main__":
    print("🔥 Module 4 Backend Running at http://localhost:5001")
    app.run(port=5001, debug=True)
