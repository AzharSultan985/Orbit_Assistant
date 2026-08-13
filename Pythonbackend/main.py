import asyncio
import threading
import speech_recognition as sr

import server
import sys

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")
from commands.speak import speak
from controller.qroq import ask_ollama
from controller.orbitMode import OrbitMode
from controller.orbit_log import orbit_log
from controller.message import process_message_command


# =====================================================
# START FASTAPI SERVER
# =====================================================

def start_api_server():

    orbit_log("Starting Orbit Python API...")

    server.start_server()


api_thread = threading.Thread(
    target=start_api_server,
    daemon=True
)

api_thread.start()


# =====================================================
# ORBIT STATE
# =====================================================

orbit_active = False


# =====================================================
# PROCESS COMMAND
# =====================================================

def is_message_command(cmd):
    cmd = cmd.lower().strip()

    keywords = [
        "message",
        "whatsapp",
        "send message",
        "send a message",
        "message kro",
        "text",
        "ko message"
    ]

    return any(keyword in cmd for keyword in keywords)


async def processCommand(cmd):

    global orbit_active

    original_cmd = cmd
    cmd = cmd.lower().strip()

    orbit_log(f"\nCommand: {original_cmd}")

    # =================================================
    # MESSAGE COMMAND
    # =================================================

    if is_message_command(cmd):

        await OrbitMode("thinking")

        orbit_log("================================")
        orbit_log("MESSAGE COMMAND DETECTED")
        orbit_log(f"Command: {original_cmd}")
        orbit_log("================================")

        try:

            result = await process_message_command(
                original_cmd
            )

            if result:

                recipient = result.get(
                    "recipient",
                    "the contact"
                )

                message = result.get(
                    "message",
                    ""
                )

                orbit_log(
                    f"Recipient: {recipient}"
                )

                orbit_log(
                    f"Message: {message}"
                )

                # IMPORTANT:
                # process_message_command already handles
                # WhatsApp opening/sending.

                await speak(
                    f"Message sent to {recipient}."
                )

            else:

                await speak(
                    "I could not send the message."
                )

        except Exception as e:

            orbit_log(
                f"Message command error: {e}"
            )

            await speak(
                "I could not send the message."
            )

        # =================================================
        # VERY IMPORTANT
        # Don't send message command to normal Groq AI
        # =================================================

        if orbit_active:
            await OrbitMode("listening")

        return

    # =================================================
    # IDLE MODE
    # =================================================

    if not orbit_active:

        if cmd == "orbit":

            orbit_active = True

            await speak(
                "Yes, I'm listening."
            )

        return

    # =================================================
    # STOP ORBIT
    # =================================================

    if cmd in [
        "stop orbit",
        "orbit stop",
        "stop"
    ]:

        orbit_active = False

        await OrbitMode("idle")

        await speak(
            "Okay."
        )

        return

    # =================================================
    # NORMAL AI COMMAND
    # =================================================

    await OrbitMode("thinking")

    orbit_log(
        f"Command for AI: {original_cmd}"
    )

    try:

        response = await asyncio.to_thread(
            ask_ollama,
            original_cmd
        )

        if response:

            await speak(response)

    except Exception as e:

        orbit_log(
            f"AI command error: {e}"
        )

        await speak(
            "Sorry, I could not process that request."
        )

    # =================================================
    # LISTEN AGAIN
    # =================================================

    if orbit_active:

        await OrbitMode("listening")

# =====================================================
# MAIN
# =====================================================

async def main():

    global orbit_active


    # =================================================
    # STARTUP LOGS
    # =================================================

    orbit_log("================================")
    orbit_log("       ORBIT AI ASSISTANT")
    orbit_log("================================")

    orbit_log(
        "Python API started on:"
    )

    orbit_log(
        "http://127.0.0.1:5000"
    )


    # =================================================
    # STARTUP SPEECH
    # =================================================

    await speak(
        "Hello. Orbit is ready."
    )

    await OrbitMode("idle")


    # =================================================
    # SPEECH RECOGNIZER
    # =================================================

    recognizer = sr.Recognizer()

    recognizer.pause_threshold = 2.0
    recognizer.phrase_threshold = 0.3
    recognizer.non_speaking_duration = 0.8


    # =================================================
    # MICROPHONE CALIBRATION
    # =================================================

    orbit_log(
        "Calibrating microphone..."
    )

    with sr.Microphone() as source:

        recognizer.adjust_for_ambient_noise(
            source,
            duration=1
        )

    orbit_log(
        "Microphone ready."
    )


    # =================================================
    # INITIAL MIC STATE
    # =================================================

    last_mic_state = server.mic_enabled


    # =================================================
    # LISTEN LOOP
    # =================================================

    while True:

        try:

            # =========================================
            # MIC OFF
            # =========================================

            if not server.mic_enabled:

                # Only execute when state changes
                # ON -> OFF

                if last_mic_state is True:

                    last_mic_state = False

                    # Stop Orbit session
                    orbit_active = False

                    orbit_log(
                        "Microphone disabled."
                    )

                    await OrbitMode(
                        "idle"
                    )

                # Don't continuously call OrbitMode
                await asyncio.sleep(0.1)

                continue


            # =========================================
            # MIC ON
            # =========================================

            if last_mic_state is False:

                last_mic_state = True

                orbit_log(
                    "Microphone enabled."
                )

                await OrbitMode(
                    "idle"
                )


            # =========================================
            # LISTEN
            # =========================================

            with sr.Microphone() as source:

                if orbit_active:

                    orbit_log(
                        "Listening for command..."
                    )

                else:

                    orbit_log(
                        "Listening for 'Orbit'..."
                    )


                audio = recognizer.listen(
                    source,
                    timeout=5
                )


            # =========================================
            # SPEECH → TEXT
            # =========================================

            orbit_log(
                "Converting speech..."
            )


            word = recognizer.recognize_google(
                audio
            )


            orbit_log(
                f"You said: {word}"
            )


            # =========================================
            # PROCESS COMMAND
            # =========================================

            await processCommand(
                word
            )


        # =============================================
        # NO SPEECH
        # =============================================

        except sr.WaitTimeoutError:

            orbit_log(
                "No speech detected."
            )


        # =============================================
        # UNKNOWN SPEECH
        # =============================================

        except sr.UnknownValueError:

            orbit_log(
                "Could not understand audio."
            )


        # =============================================
        # GOOGLE API ERROR
        # =============================================

        except sr.RequestError as e:

            orbit_log(
                f"Speech recognition error: {e}"
            )


        # =============================================
        # OTHER ERROR
        # =============================================

        except Exception as e:

            orbit_log(
                f"Error: {e}"
            )

            await asyncio.sleep(
                0.5
            )


# =====================================================
# START ORBIT
# =====================================================

if __name__ == "__main__":

    try:

        asyncio.run(
            main()
        )

    except KeyboardInterrupt:

        orbit_log(
            "Orbit stopped."
        )