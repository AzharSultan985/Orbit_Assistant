import edge_tts
import asyncio
import os
import uuid
import pygame
from controller.orbit_log import orbit_log

from controller.orbitMode import OrbitMode

VOICE = "en-IN-NeerjaNeural"

pygame.mixer.init()


async def speak(text):

    if not text:
        return

    filename = f"orbit_{uuid.uuid4().hex}.mp3"

    try:

        orbit_log(f"ORBIT: {text}")

        # -----------------------------------------
        # Generate TTS
        # -----------------------------------------

        communicate = edge_tts.Communicate(
            text,
            voice=VOICE
        )

        await communicate.save(filename)

        # -----------------------------------------
        # Orbit speaking
        # -----------------------------------------

        await OrbitMode("speaking")

        # -----------------------------------------
        # Play
        # -----------------------------------------

        pygame.mixer.music.load(filename)
        pygame.mixer.music.play()

        while pygame.mixer.music.get_busy():
            await asyncio.sleep(0.02)

    except Exception as e:

        orbit_log(f"Speech error: {e}")

    finally:

        # -----------------------------------------
        # Stop + release MP3
        # -----------------------------------------

        try:
            pygame.mixer.music.stop()
            pygame.mixer.music.unload()
        except Exception:
            pass

        # -----------------------------------------
        # Delete generated MP3
        # -----------------------------------------

        if os.path.exists(filename):

            try:
                os.remove(filename)
                orbit_log(f"Deleted: {filename}")

            except PermissionError:

                orbit_log(
                    f"Could not delete {filename} "
                    "(file still in use)"
                )

        # -----------------------------------------
        # Back to listening
        # -----------------------------------------

        await OrbitMode("listening")