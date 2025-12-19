

import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";

const API_URL = "http://localhost:5001/chat";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const endRef = useRef(null);

  // 🎙 Voice recognition reference (created only ONCE)
  const recognitionRef = useRef(null);

  // Initialize speech recognition ONCE
  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recog = new window.webkitSpeechRecognition();
      recog.lang = "en-IN";
      recog.continuous = true;
      recog.interimResults = false;
      recog.maxAlternatives = 1;

      recog.onstart = () => console.log("🎤 Listening...");
      recog.onend = () => {
        console.log("🛑 Stopped listening");
        setListening(false);
      };
      recog.onerror = (e) => console.log("❌ Error:", e.error);

      recognitionRef.current = recog;
    }
  }, []);

  // Show welcome message when bot opens
  useEffect(() => {
    const welcomeText =
      "Welcome to Trust Bank Assistant! How can I help you today?";
    setMessages([{ sender: "bot", type: "text", text: welcomeText }]);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔊 BOT SPEAKS
  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    speech.rate = 1.0;
    window.speechSynthesis.speak(speech);
  };

  // 🎤 Start voice input
  const handleVoiceInput = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      alert("Your browser does not support voice input");
      return;
    }

    if (!listening) {
      setListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        console.log("🎤 Heard:", spokenText);
        setInput(spokenText); // instantly update input box
      };
    }
  };

  // 📨 SEND MESSAGE
  async function sendMessage() {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { sender: "user", type: "text", text: input },
    ]);

//     const res = await fetch(API_URL, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     // "user_name": localStorage.getItem("user_name") || "Guest"
//     "user_email": localStorage.getItem("user_email")
//   },
//   body: JSON.stringify({ message: input }),
// });

    const res = await fetch(API_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    message: input,
    user_email: localStorage.getItem("user_email")
  }),
});



    const data = await res.json();
    const replies = data.responses || [];

    replies.forEach((reply) => {
      if (reply.startsWith("MAP_URL:")) {
        const url = reply.replace("MAP_URL:", "");
        setMessages((prev) => [
          ...prev,
          { sender: "bot", type: "map", url },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", type: "text", text: reply },
        ]);
      }
    });

    setInput("");
  }

  return (
    <div className="chat-container">
      <div className="chat-box">
        {/* Header */}
        <div className="chat-header">
          <img
            src="https://dbl-discord.usercontent.prism.gg/avatars/1203417647048433767/5bbdcbc27c6cbc3c926833d0c8a42dcb.png?size=256"
            className="bot-logo"
            alt="logo"
          />
          <span>TrustBank Assistant</span>
        </div>

        {/* Messages */}
        <div className="chat-body">
          {messages.map((msg, i) => (
            <div key={i} className={`message-row ${msg.sender}`}>
              {/* Avatar */}
              <img
                src={
                  msg.sender === "user"
                    ? "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    : "https://www.pngplay.com/wp-content/uploads/6/Bank-Logo-Transparent-PNG.png"
                }
                className="avatar"
              />

              {/* Text bubble */}
              {msg.type === "text" && (
                <div className={`chat-bubble ${msg.sender}`}>
                  <div
                    className="bot-html"
                    dangerouslySetInnerHTML={{ __html: msg.text }}
                  ></div>

                  {msg.sender === "bot" && (
                    <button className="speak-btn" onClick={() => speak(msg.text)}>
                      🔊
                    </button>
                  )}
                </div>
              )}

              {/* MAP Embed */}
              {msg.type === "map" && (
                <div className="map-container">
                  <iframe
                    src={msg.url}
                    width="100%"
                    height="200"
                    style={{ border: "0", borderRadius: "12px" }}
                    loading="lazy"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          ))}
          <div ref={endRef}></div>
        </div>

        {/* Input Area */}
        <div className="chat-input">
          <input
            className="chat-textbox"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />

          {/* Mic Button */}
          <button className="icon-btn" onClick={handleVoiceInput}>
            <img
              src="https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968243_960_720.png"
              alt="mic"
              className="icon-img"
            />
          </button>

          {/* Send Button */}
          <button className="icon-btn" onClick={sendMessage}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
