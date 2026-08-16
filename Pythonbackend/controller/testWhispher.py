from microphone import record_audio
from Speak_to_Text import Speech_to_text
import os


audio_file = record_audio()

if audio_file:

    text = Speech_to_text(
        audio_file
    )

    print("\nYou said:")
    print(text)

    if os.path.exists(audio_file):
        os.remove(audio_file)