
from controller.orbit_log import orbit_log

import time
import subprocess
import pyautogui
import pyperclip
import pygetwindow as gw




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

        # close whatsapp
        try:
            window.close()
            time.sleep(1)
            orbit_log("whatsapp close")
        except Exception as e :
            orbit_log(f"whatsapp not close {e}")
            
        return True

    except Exception as e:

        orbit_log(
            f"WhatsApp automation error: {e}"
        )

        return False