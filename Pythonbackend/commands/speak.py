import asyncio
import os
import uuid
import re
import subprocess
import pygame

from controller.orbit_log import orbit_log
from controller.orbitMode import OrbitMode


PIPER_MODEL = "en_US-lessac-medium"

pygame.mixer.init()


# =====================================================
# CLEAN TEXT
# =====================================================

def clean_text(text):

    if not text:
        return ""

    text = str(text)

    replacements = {
        "\u202f": " ",
        "\u00a0": " ",
        "\u2007": " ",
        "\u2009": " ",
        "\u2011": "-",
        "\u2013": "-",
        "\u2014": "-",
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
    }

    for old, new in replacements.items():
        text = text.replace(old, new)

    # Remove markdown
    text = re.sub(r"```(?:\w+)?", "", text)
    text = re.sub(r"```", "", text)
    text = re.sub(r"\*([^*]+)\*", r"\1", text)
    text = re.sub(r"_([^_]+)_", r"\1", text)

    # Remove headings
    text = re.sub(
        r"^#+\s*",
        "",
        text,
        flags=re.MULTILINE
    )

    # Normalize whitespace
    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


# =====================================================
# GENERATE ONE COMPLETE AUDIO FILE
# =====================================================

async def generate_audio(text):

    filename = f"orbit_{uuid.uuid4().hex}.wav"

    try:

        orbit_log(
            "Piper generating complete response..."
        )

        process = await asyncio.create_subprocess_exec(

            "piper",

            "--model",
            PIPER_MODEL,

            "--output_file",
            filename,

            stdin=asyncio.subprocess.PIPE,

            stdout=asyncio.subprocess.DEVNULL,

            stderr=asyncio.subprocess.PIPE
        )

        _, stderr = await process.communicate(
            input=text.encode("utf-8")
        )

        if process.returncode != 0:

            error = stderr.decode(
                "utf-8",
                errors="replace"
            )

            raise RuntimeError(error)

        if not os.path.exists(filename):

            raise RuntimeError(
                "Piper did not create audio file."
            )

        orbit_log(
            "Piper audio ready."
        )

        return filename

    except Exception as e:

        orbit_log(
            f"Piper generation error: {e}"
        )

        if os.path.exists(filename):

            try:
                os.remove(filename)
            except Exception:
                pass

        return None


# =====================================================
# PLAY AUDIO
# =====================================================

async def play_audio(filename):

    try:

        pygame.mixer.music.load(filename)

        pygame.mixer.music.play()

        while pygame.mixer.music.get_busy():

            await asyncio.sleep(0.01)

    finally:

        try:
            pygame.mixer.music.stop()
        except Exception:
            pass

        try:
            pygame.mixer.music.unload()
        except Exception:
            pass


# =====================================================
# DELETE AUDIO
# =====================================================

async def delete_audio(filename):

    if not filename:
        return

    if not os.path.exists(filename):
        return

    for _ in range(5):

        try:

            os.remove(filename)

            orbit_log(
                f"Deleted audio: {filename}"
            )

            return

        except PermissionError:

            await asyncio.sleep(0.1)

        except Exception as e:

            orbit_log(
                f"Audio deletion error: {e}"
            )

            return


# =====================================================
# SPEAK
# =====================================================

async def speak(text):

    text = clean_text(text)

    if not text:
        return

    await OrbitMode("speaking")

    filename = None

    try:

        orbit_log(
            "ORBIT SPEAKING"
        )

        # ONE response → ONE WAV
        filename = await generate_audio(text)

        if not filename:

            return

        # Play complete response
        await play_audio(filename)

    except Exception as e:

        orbit_log(
            f"Speech pipeline error: {e}"
        )

    finally:

        # Delete ONLY after complete playback
        if filename:

            await delete_audio(filename)

        await OrbitMode("listening")