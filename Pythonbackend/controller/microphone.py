import sounddevice as sd
import soundfile as sf
import uuid
import os
import numpy as np

SAMPLE_RATE = 16000
CHANNELS = 1

# User ke bolna band karne ke baad
# itni silence par recording stop hogi
SILENCE_DURATION = 3.0

# Maximum ek command ki recording
MAX_COMMAND_DURATION = 50.0

# Microphone sensitivity
SILENCE_THRESHOLD = 0.015


async def record_audio():

    filename = f"orbit_audio_{uuid.uuid4().hex}.wav"

    try:

        print("\nListening...")

        frames = []

        recording_started = False
        silence_time = 0.0
        elapsed_time = 0.0

        # Har 100ms ka audio chunk
        chunk_duration = 0.1

        chunk_size = int(
            SAMPLE_RATE * chunk_duration
        )

        with sd.InputStream(
            samplerate=SAMPLE_RATE,
            channels=CHANNELS,
            dtype="float32",
            blocksize=chunk_size
        ) as stream:

            while True:

                audio_chunk, overflowed = stream.read(
                    chunk_size
                )

                audio_chunk = audio_chunk.copy()

                frames.append(audio_chunk)

                elapsed_time += chunk_duration

                print
                # Calculate microphone volume
                print

                volume = float(
                    np.sqrt(
                        np.mean(
                            audio_chunk ** 2
                        )
                    )
                )

               

                if volume > SILENCE_THRESHOLD:

                    if not recording_started:

                        recording_started = True

                        print(
                            "Speech detected..."
                        )

                    silence_time = 0.0

                

                else:

                    if recording_started:

                        silence_time += chunk_duration

                        print(
                            f"\rSilence: {silence_time:.1f}s",
                            end=""
                        )

                        # 3 seconds silence
                        if silence_time >= SILENCE_DURATION:

                            print()

                            print(
                                "Speech finished."
                            )

                            break

               
                if elapsed_time >= MAX_COMMAND_DURATION:

                    print()

                    print(
                        "Maximum recording duration reached."
                    )

                    break

      
        # Nothing was spoken
        

        if not recording_started:

            print(
                "No speech detected."
            )

        if os.path.exists(filename):
            os.remove(filename)

            return None

   
        # Combine all chunks
     

        audio = np.concatenate(
            frames,
            axis=0
        )

      

        sf.write(
            filename,
            audio,
            SAMPLE_RATE
        )

        print(
            f"Audio recorded: {filename}"
        )

        return filename
        if os.path.exists(filename):
            os.remove(filename)
    except Exception as e:

        print(
            f"Microphone error: {e}"
        )

    
        return None

            