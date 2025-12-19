
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.events import SlotSet, FollowupAction, EventType
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.forms import FormValidationAction
from rasa_sdk.types import DomainDict
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random
import re 
import logging
# ------------------------------------
# General Safety Check for Text Slots
# ------------------------------------
def safe_text_validation(slot_value: Any, valid_options: List[str] = None) -> bool:
    """Checks if the slot_value is a string and, optionally, in a list of valid options."""
    if not isinstance(slot_value, str):
        return False
    
    # Simple check for general text slots
    if valid_options is None:
        return True
    
    # Check against valid options (e.g., 'savings', 'current')
    return slot_value.lower() in valid_options

# ----------------------------
# Form Validation for Branch (The only active form)
# ----------------------------
class ValidateBranchForm(FormValidationAction):
    def name(self) -> Text:
        # This name MUST match the 'validate_branch_form' defined in the domain
        return "validate_branch_form"

    def validate_city(self, slot_value: Any, dispatcher: CollectingDispatcher, tracker: Tracker, domain: DomainDict) -> Dict[Text, Any]:
        if safe_text_validation(slot_value):
            return {"city": slot_value}
        
        dispatcher.utter_message(text="Please enter a valid city name.")
        return {"city": None}

# ----------------------------
# Custom Actions (Finalization - ALL include requested_slot/active_loop clear)
# ----------------------------

#         # FINAL FIX: Clear loop and slot after successful completion
#         return [
#             SlotSet("city", None),
#             SlotSet("requested_slot", None),
#             SlotSet("active_loop", None)
#         ]

class ActionFindLocation(Action):
    def name(self) -> Text:
        return "action_find_location"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        city = tracker.get_slot("city")

        if not city:
            dispatcher.utter_message(text="I need a city to find the nearest ATM or branch.")
            return []

        maps_link = f"https://www.google.com/maps/search/ATM+in+{city.replace(' ', '+')}"

        dispatcher.utter_message(
            text=(
                f"The nearest branch/ATM in {city.title()} can be found here:<br>"
                f"👉 <a href='{maps_link}' target='_blank'>View on Google Maps</a>"
            )
        )

        return [
            SlotSet("city", None),
            SlotSet("requested_slot", None),
            SlotSet("active_loop", None)
        ]



class ActionDefaultFallback(Action):
    def name(self) -> Text:
        # This name MUST exactly match the name in your rules.yml
        return "action_default_fallback"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # This is the message the bot will send during a generic fallback
        dispatcher.utter_message(text="I'm having trouble understanding. Please rephrase your banking-related request.")
        return []
    


# # ----------------------------
# # LOCATION ACTIONS (for completeness)
# # ----------------------------


class ActionSendOtp(Action):
    def name(self):
        return "action_send_otp"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: dict):

        email = tracker.get_slot("email")

        # Generate a 6-digit OTP
        otp = str(random.randint(100000, 999999))

        # ------------------------------------
        # Gmail sender email & app password
        # ------------------------------------
        SENDER_EMAIL = "trushaligodbole4@gmail.com"
        SENDER_PASSWORD = "jvul gmhk ttdh ztif"

        # Email content
        subject = "Your OTP Verification Code"
        message = f"Your OTP is: {otp}"

        msg = MIMEMultipart()
        msg["From"] = SENDER_EMAIL
        msg["To"] = email
        msg["Subject"] = subject
        msg.attach(MIMEText(message, "plain"))

        try:
            # Send email using Gmail SMTP
            server = smtplib.SMTP("smtp.gmail.com", 587)
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, email, msg.as_string())
            server.quit()
        except Exception as e:
            dispatcher.utter_message(text=f"Failed to send OTP: {str(e)}")

        dispatcher.utter_message(
            text=f"OTP sent to your email {email}"
        )

        return [
            SlotSet("server_otp", otp),
            SlotSet("otp_verified", False),
            SlotSet("email_verified", False)
        ]
        
#             ]
class ActionVerifyOtp(Action):

    def name(self):
        return "action_verify_otp"

    def mask_email(self, email):
        """Mask email like t**********e@gmail.com"""
        name, domain = email.split("@")
        if len(name) <= 2:
            masked = name[0] + "*"
        else:
            masked = name[0] + "*" * (len(name) - 2) + name[-1]
        return masked + "@" + domain

    def run(self, dispatcher, tracker, domain):

        user_otp = tracker.latest_message.get("text")        # OTP user typed
        server_otp = tracker.get_slot("server_otp")          # OTP bot generated
        email = tracker.get_slot("email")                    # saved email

        # ❌ if server OTP missing → error
        if not server_otp:
            dispatcher.utter_message(text="OTP not generated. Please request again.")
            return []

        # ✅ OTP MATCH — SHOW BALANCE
        if user_otp == server_otp:

            masked_email = self.mask_email(email)

            dispatcher.utter_message(text=f"Email verified: {masked_email}")
            dispatcher.utter_message(text="Verification successful!")
            dispatcher.utter_message(text="Your account balance is ₹35,000.")

            return [
    SlotSet("otp_verified", True),
    FollowupAction("action_listen")
]



        # ❌ OTP FAIL
        dispatcher.utter_message(text="Incorrect OTP. Please try again.")
        return []



# ------------------------------------------------
# 3️⃣ ACTION — SUBMIT FORM AFTER SUCCESSFUL OTP
# ------------------------------------------------
class ActionSubmitAuth(Action):
    def name(self):
        return "action_submit_auth"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: dict):

        # No message here — rules.yml will trigger utter_verified
        return []


# ------------------------------------------------
# 4️⃣ SHOW BALANCE AFTER VERIFICATION
# ------------------------------------------------
class ActionCheckBalance(Action):
    def name(self):
        return "action_check_balance"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: dict):

        if tracker.get_slot("email_verified"):
            dispatcher.utter_message(text="Your account balance is ₹35,000.")
        else:
            dispatcher.utter_message(text="Please verify with your email first.")

        return []
    
class ActionCheckCreditCardBalance(Action):

    def name(self) -> Text:
        return "action_check_creditcard_balance"

    def run(self, dispatcher, tracker, domain):

        if tracker.get_slot("otp_verified") is True:
            dispatcher.utter_message(text="Your credit card outstanding balance is ₹12,750.")
        else:
            dispatcher.utter_message(text="Please verify your email to continue.")

        return []
    
