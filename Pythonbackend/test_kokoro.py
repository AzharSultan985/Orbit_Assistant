from kokoro import KPipeline
import soundfile as sf

pipeline = KPipeline(lang_code="a")

text = """
Hello Azhar. I am Orbit, your personal AI assistant.
I am ready to help you with your work, manage your computer,
answer your questions, search for information, and assist you
with your daily tasks. Everything is running locally on your
system, and I am ready whenever you need me.
"""

voices = [
    "af_bella",
    "af_nicole",
    "af_sarah",
    "am_michael",
    "am_fenrir",
]

for voice in voices:

    print(f"Generating: {voice}")

    generator = pipeline(
        text,
        voice=voice,
        speed=0.95
    )

    for i, (_, _, audio) in enumerate(generator):

        filename = f"orbit_{voice}_{i}.wav"

        sf.write(
            filename,
            audio,
            24000
        )

        print(f"Saved: {filename}")