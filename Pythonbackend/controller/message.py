import asyncio
import json
import requests

from controller.orbit_log import orbit_log

import time
import subprocess
import pyautogui
import pyperclip
import pygetwindow as gw

NODE_URL = "http://localhost:3002/api/v2/orbit/message"


# =====================================================
# PROCESS MESSAGE COMMAND
# =====================================================

async def process_message_command(command):

    orbit_log(
        "Processing WhatsApp message command..."
    )

    try:

        # ---------------------------------------------
        # Ask Node/Groq to understand command
        # ---------------------------------------------

        result = await asyncio.to_thread(
            extract_message,
            command
        )

        if not result:
            return None

        recipient = result.get("recipient")
        message = result.get("message")

        if not recipient or not message:

            orbit_log(
                "Recipient or message missing."
            )

            return None

        orbit_log(
            f"Recipient: {recipient}"
        )

        orbit_log(
            f"Message: {message}"
        )

        # ---------------------------------------------
        # SEND WHATSAPP MESSAGE
        # ---------------------------------------------

        success = await asyncio.to_thread(
            send_whatsapp_message,
            recipient,
            message
        )

        if not success:
            return None

        return {
            "recipient": recipient,
            "message": message
        }

    except Exception as e:

        orbit_log(
            f"Message controller error: {e}"
        )

        return None


# =====================================================
# NODE → GROQ
# =====================================================

def extract_message(command):

    try:

        orbit_log(
            "Sending message command to Node..."
        )

        response = requests.post(

            NODE_URL,

            json={
                "command": command
            },

            timeout=30
        )

        response.raise_for_status()

        data = response.json()

        raw_response = data.get(
            "response",
            ""
        )

        if not raw_response:

            orbit_log(
                "Node returned empty response."
            )

            return None

        # ---------------------------------------------
        # Remove accidental markdown
        # ---------------------------------------------

        raw_response = (
            raw_response
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        result = json.loads(
            raw_response
        )

        return result

    except requests.exceptions.Timeout:

        orbit_log(
            "Message extraction request timed out."
        )

        return None

    except requests.exceptions.ConnectionError:

        orbit_log(
            "Cannot connect to Node backend."
        )

        return None

    except json.JSONDecodeError:

        orbit_log(
            "Groq returned invalid JSON."
        )

        return None

    except Exception as e:

        orbit_log(
            f"Message extraction error: {e}"
        )

        return None


# =====================================================
# WHATSAPP
# =====================================================



def open_whatsapp():

    # Try to open WhatsApp Desktop
    try:

        subprocess.Popen(
            ["cmd", "/c", "start", "", "whatsapp:"],
            shell=False
        )

    except Exception as e:

        orbit_log(
            f"Could not launch WhatsApp: {e}"
        )

    # Wait for window
    for _ in range(10):

        time.sleep(1)

        windows = gw.getWindowsWithTitle(
            "WhatsApp"
        )

        if windows:

            window = windows[0]

            try:

                if window.isMinimized:
                    window.restore()

                window.activate()

                time.sleep(1)

                return window

            except Exception as e:

                orbit_log(
                    f"Could not activate WhatsApp: {e}"
                )

    return None



def send_whatsapp_message(recipient, message):

    try:

        orbit_log(
            "================================"
        )

        orbit_log(
            f"Opening WhatsApp for {recipient}..."
        )

        orbit_log(
            "================================"
        )

        # =================================================
        # OPEN / ACTIVATE WHATSAPP
        # =================================================

        window = open_whatsapp()

        if not window:

            orbit_log(
                "WhatsApp Desktop window not found."
            )

            return False

        # =================================================
        # SEARCH
        # =================================================

        orbit_log(
            f"Searching for {recipient}..."
        )

        pyautogui.hotkey(
            "ctrl",
            "f"
        )

        time.sleep(0.7)

        pyperclip.copy(
            recipient
        )

        pyautogui.hotkey(
            "ctrl",
            "v"
        )

        time.sleep(2)

        # =================================================
        # SELECT CONTACT
        # =================================================

        pyautogui.press(
            "down"
        )

        time.sleep(0.5)

        pyautogui.press(
            "enter"
        )

        time.sleep(1.5)

        # =================================================
        # TYPE MESSAGE
        # =================================================

        orbit_log(
            f"Typing message: {message}"
        )

        pyperclip.copy(
            message
        )

        pyautogui.hotkey(
            "ctrl",
            "v"
        )

        time.sleep(0.5)

        # =================================================
        # SEND
        # =================================================

        pyautogui.press(
            "enter"
        )

        time.sleep(1)

        orbit_log(
            f"Message sent to {recipient}."
        )

        return True

    except Exception as e:

        orbit_log(
            f"WhatsApp automation error: {e}"
        )

        return False