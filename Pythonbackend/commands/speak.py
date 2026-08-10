
import os

# =====================================================
# HUGGING FACE CACHE
# MUST BE SET BEFORE IMPORTING KOKORO
# =====================================================

HF_HOME = r"G:\Orbit Ai Assistant\Models\huggingface"

os.environ["HF_HOME"] = HF_HOME
os.environ["HF_HUB_CACHE"] = os.path.join(HF_HOME, "hub")
os.environ["TRANSFORMERS_CACHE"] = os.path.join(HF_HOME, "transformers")

# Create cache directories
os.makedirs(os.environ["HF_HUB_CACHE"], exist_ok=True)
os.makedirs(os.environ["TRANSFORMERS_CACHE"], exist_ok=True)


# =====================================================
# IMPORTS
# =====================================================

from kokoro import KPipeline
import soundfile as sf
import pygame
import asyncio
import uuid


# =====================================================
# KOKORO
# =====================================================

print("Loading Orbit voice engine...")

pipeline = KPipeline(lang_code="a")

ORBIT_VOICE = "am_fenrir"
ORBIT_SPEED = 0.92

print("Orbit voice engine ready.")


# =====================================================
# SPEAK
# =====================================================

async def speak(text):

    print(f"ORBIT: {text}")

    filename = os.path.join(
        HF_HOME,
        f"orbit_{uuid.uuid4().hex}.wav"
    )

    try:

        # Generate speech
        generator = pipeline(
            text,
            voice=ORBIT_VOICE,
            speed=ORBIT_SPEED
        )

        # Save generated audio
        for _, _, audio in generator:

            sf.write(
                filename,
                audio,
                24000
            )

        # Initialize pygame once
        if not pygame.mixer.get_init():
            pygame.mixer.init()

        # Play
        pygame.mixer.music.load(filename)
        pygame.mixer.music.play()

        # Wait until finished
        while pygame.mixer.music.get_busy():
            await asyncio.sleep(0.05)

        pygame.mixer.music.stop()

    except Exception as e:

        print("Speech error:", e)

    finally:

        try:
            pygame.mixer.music.unload()
        except Exception:
            pass

        if os.path.exists(filename):

            try:
                os.remove(filename)
            except PermissionError:
                pass
