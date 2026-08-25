import asyncio
import threading
import sys

import server

from controller.microphone import record_audio
from controller.Speak_to_Text import Speech_to_text

from controller.speak import speak
from controller.orbitMode import OrbitMode
from ModelController.GroqLLM import OrbitAgent
from controller.sendCmdToNode import Node_Mess_save
# from controller.print import print



# UTF-8


sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")



# ORBIT STATE


orbit_active = False



# START API SERVER


def start_api_server():

    print(
        "Starting Orbit Python API..."
    )

    server.start_server()


api_thread = threading.Thread(
    target=start_api_server,
    daemon=True
)

api_thread.start()



# WAKE WORD


WAKE_WORD = "orbit"



# MAIN


async def main():

    global orbit_active

    # =================================================
    # STARTUP
    # =================================================

    print("================================")
    print("       ORBIT AI ASSISTANT")
    print("================================")

    print(
        "Python API started on:"
    )

    print(
        "http://127.0.0.1:5000"
    )

    await speak(
        "Hello. Orbit is ready."
    )

    await OrbitMode(
        "idle"
    )


    while True:

        try:
            if not server.mic_enabled:
                await OrbitMode("idle")
                await asyncio.sleep(0.3)
            audio_file = await record_audio()

            if not audio_file:

                print(
                    "No command detected." )

                continue

            await OrbitMode(
                "thinking"
            )

            print(
                "Converting command to text..."
            )

            text = await Speech_to_text(
                audio_file
            )

            if not text:

                print(
                    "Could not understand command."
                )

                await OrbitMode(
                    "listening"
                )

                continue

            print(
                f"\nYou said: {text}\n"
            )

            Node_Mess_save(text)
            response = OrbitAgent(text)
            Node_Mess_save(response,"orbit")

            
            await speak(response)





            await OrbitMode(
                "listening"
            )

        
        # CTRL + C
        

        except KeyboardInterrupt:

            raise

        
        # GENERAL ERROR
        

        except Exception as e:

            print(
                f"Orbit error: {e}"
            )

            await asyncio.sleep(
                0.5
            )



# START ORBIT


if __name__ == "__main__":

    try:

        asyncio.run(
            main()
        )

    except KeyboardInterrupt:

        orbit_active = False

        print(
            "Orbit stopped."
        )