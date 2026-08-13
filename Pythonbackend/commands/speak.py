import edge_tts
import asyncio
import os
import uuid
import pygame
import re

from controller.orbit_log import orbit_log
from controller.orbitMode import OrbitMode


VOICE = "en-IN-NeerjaNeural"

pygame.mixer.init()


# =====================================================
# CLEAN TEXT
# =====================================================

def clean_text(text):

    text = str(text)

    replacements = {
        "\u202f": " ",
        "\u00a0": " ",
        "\u2007": " ",
        "\u2009": " ",
        "\u2013": "-",
        "\u2014": "-",
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
    }

    for old, new in replacements.items():
        text = text.replace(old, new)

    # Remove markdown code fences
    text = re.sub(
        r"```[\w]*",
        "",
        text
    )

    # Remove markdown headings
    text = re.sub(
        r"^#+\s*",
        "",
        text,
        flags=re.MULTILINE
    )

    # Remove excessive whitespace
    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


# =====================================================
# SPLIT INTO SENTENCES
# =====================================================

def split_text(text):

    text = clean_text(text)

    if not text:
        return []

    sentences = re.split(
        r'(?<=[.!?])\s+',
        text
    )

    return [
        sentence.strip()
        for sentence in sentences
        if sentence.strip()
    ]


# =====================================================
# GENERATE AUDIO
# =====================================================

async def generate_audio(text, index):

    filename = (
        f"orbit_{uuid.uuid4().hex}_{index}.mp3"
    )

    communicate = edge_tts.Communicate(
        text,
        voice=VOICE
    )

    await communicate.save(filename)

    orbit_log(
        f"TTS ready [{index}]: {text}"
    )

    return filename


# =====================================================
# PLAY AUDIO
# =====================================================

async def play_audio(filename):

    pygame.mixer.music.load(filename)

    pygame.mixer.music.play()

    while pygame.mixer.music.get_busy():

        await asyncio.sleep(0.01)

    try:
        pygame.mixer.music.stop()
        pygame.mixer.music.unload()
    except Exception:
        pass


# =====================================================
# SPEAK
# =====================================================

async def speak(text):

    if not text:
        return

    text = clean_text(text)

    if not text:
        return

    sentences = split_text(text)

    if not sentences:
        return

    orbit_log(
        f"ORBIT SPEAKING: {len(sentences)} sentences"
    )

    await OrbitMode("speaking")

    audio_queue = asyncio.Queue()

    async def producer():

        try:

            # Generate sentences in parallel,
            # but put them into the queue
            # according to their original order.

            tasks = [
                asyncio.create_task(
                    generate_audio(
                        sentence,
                        index
                    )
                )
                for index, sentence
                in enumerate(sentences)
            ]

            # IMPORTANT:
            # gather() preserves the original order.

            files = await asyncio.gather(
                *tasks
            )

            for filename in files:

                await audio_queue.put(
                    filename
                )

        finally:

            await audio_queue.put(None)


    async def consumer():

        while True:

            filename = await audio_queue.get()

            if filename is None:
                break

            try:

                await play_audio(
                    filename
                )

            finally:

                if os.path.exists(filename):

                    try:
                        os.remove(filename)

                    except PermissionError:
                        pass


    try:

        # Producer generates audio
        # Consumer plays audio simultaneously.

        await asyncio.gather(
            producer(),
            consumer()
        )

    except Exception as e:

        orbit_log(
            f"Speech pipeline error: {e}"
        )

    finally:

        try:

            pygame.mixer.music.stop()
            pygame.mixer.music.unload()

        except Exception:
            pass

        await OrbitMode("listening")