
import asyncio
import queue
import time

import numpy as np
import sounddevice as sd
from faster_whisper import WhisperModel

from commands.speak import speak


# =====================================================
# WHISPER
# =====================================================

WHISPER_PATH = r"G:\Orbit Ai Assistant\Models\whisper"

print("Loading local Whisper model...")

model = WhisperModel(
    "base",
    device="cpu",
    compute_type="int8",
    download_root=WHISPER_PATH
)

print("Whisper model ready.")


# =====================================================
# AUDIO SETTINGS
# =====================================================

SAMPLE_RATE = 16000
CHANNELS = 1

# Audio chunk size
BLOCK_SIZE = 1024

# How much silence ends the command
SILENCE_DURATION = 2.0

# Minimum volume considered as speech
ENERGY_THRESHOLD = 0.015


# =====================================================
# AUDIO QUEUE
# =====================================================

audio_queue = queue.Queue()


def audio_callback(indata, frames, time_info, status):

    if status:
        print("Audio:", status)

    audio_queue.put(indata.copy())


# =====================================================
# GET AUDIO FROM MICROPHONE
# =====================================================

def get_audio():

    audio_queue.queue.clear()

    stream = sd.InputStream(
        samplerate=SAMPLE_RATE,
        channels=CHANNELS,
        blocksize=BLOCK_SIZE,
        callback=audio_callback
    )

    return stream


# =====================================================
# CALCULATE AUDIO ENERGY
# =====================================================

def is_speech(audio):

    energy = np.sqrt(
        np.mean(
            np.square(audio)
        )
    )

    return energy > ENERGY_THRESHOLD


# =====================================================
# WAIT FOR ORBIT
# =====================================================

def wait_for_wake_word():

    print("Listening for 'Orbit'...")

    with get_audio() as stream:

        audio_buffer = []
        last_check = time.time()

        while True:

            try:

                data = audio_queue.get(
                    timeout=1
                )

                audio_buffer.append(data)

            except queue.Empty:

                continue

            # Check every ~2 seconds
            if time.time() - last_check < 2:

                continue

            last_check = time.time()

            if not audio_buffer:

                continue

            audio = np.concatenate(
                audio_buffer,
                axis=0
            )

            audio_buffer = []

            # Whisper needs float32
            audio = audio.flatten().astype(
                np.float32
            )

            segments, info = model.transcribe(
                audio,
                beam_size=5,
                vad_filter=True,
                temperature=0
            )

            text = " ".join(
                segment.text
                for segment in segments
            ).strip().lower()

            if not text:

                continue

            print(
                f"Heard: {text}"
            )

            if "orbit" in text:

                return


# =====================================================
# LISTEN TO FULL COMMAND
# =====================================================

def listen_for_command():

    print("Orbit activated. Listening...")

    audio_buffer = []

    speech_started = False

    last_speech_time = None

    with get_audio() as stream:

        while True:

            try:

                data = audio_queue.get(
                    timeout=1
                )

            except queue.Empty:

                continue

            audio_buffer.append(data)

            # Check volume
            if is_speech(data):

                speech_started = True

                last_speech_time = time.time()

            # Stop after 2 seconds of silence
            if speech_started:

                if (
                    last_speech_time
                    and
                    time.time() - last_speech_time
                    >= SILENCE_DURATION
                ):

                    break

    if not audio_buffer:

        return None

    audio = np.concatenate(
        audio_buffer,
        axis=0
    )

    audio = audio.flatten().astype(
        np.float32
    )

    print("Converting speech to text...")

    # =================================================
    # LOCAL WHISPER
    # =================================================

    segments, info = model.transcribe(
        audio,
        beam_size=5,
        vad_filter=True,
        temperature=0
    )

    text = " ".join(
        segment.text
        for segment in segments
    ).strip()

    if text:

        print(
            f"You said: {text}"
        )

        return text

    return None


# =====================================================
# PROCESS COMMAND
# =====================================================

async def processCommand(cmd):

    print(
        f"Command: {cmd}"
    )

    cmd = cmd.lower().strip()

    # Temporary test
    await speak(cmd)


# =====================================================
# MAIN
# =====================================================

async def main():

    await speak(
        "Hello Azhar. Orbit is ready."
    )

    while True:

        # ---------------------------------------------
        # WAIT FOR ORBIT
        # ---------------------------------------------

        await asyncio.to_thread(
            wait_for_wake_word
        )

        # ---------------------------------------------
        # ORBIT DETECTED
        # ---------------------------------------------

        await speak(
            "Yes, I am listening."
        )

        # ---------------------------------------------
        # LISTEN TO COMMAND
        # ---------------------------------------------

        command = await asyncio.to_thread(
            listen_for_command
        )

        if not command:

            continue

        # ---------------------------------------------
        # EXIT
        # ---------------------------------------------

        if command in [
            "exit",
            "quit",
            "stop orbit"
        ]:

            await speak(
                "Goodbye Azhar."
            )

            break

        # ---------------------------------------------
        # PROCESS
        # ---------------------------------------------

        await processCommand(
            command
        )


# =====================================================
# START
# =====================================================

if __name__ == "__main__":

    asyncio.run(main())

