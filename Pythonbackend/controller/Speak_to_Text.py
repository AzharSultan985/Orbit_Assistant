from faster_whisper import WhisperModel
# from controller.orbit_log import orbit_log

import os
Model_Size ="small"

model = WhisperModel(
    Model_Size,
    device="cpu",
    compute_type="default"
)

async def Speech_to_text(audio_file):
    try:
       print(f"whisper transcribing:{audio_file}")

       segments,info =model.transcribe(
           audio_file,
           beam_size=5,
           vad_filter=True
       )
       text =" ".join(segment.text.strip()
                      
                      for segment in segments)
       
       text=text.strip()
       return text
    except Exception as e:
        print(f"whisper error :{e}")

        return None
    finally:
      if audio_file and os.path.exists(audio_file):

            try:

                os.remove(audio_file)

                print(
                    f"Deleted audio: {audio_file}"
                )

            except PermissionError:

                print(
                    f"Could not delete audio file "
                    f"(still in use): {audio_file}"
                )

            except Exception as e:

                print(
                    f"Audio delete error: {e}"
                )