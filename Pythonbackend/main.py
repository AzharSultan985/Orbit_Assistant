def speak(text):
    print(f"ORBIT: {text}")


def activate_orbit():
    speak("Yes ,Azhar ,I am orbit!")


def main():
    print("================================")
    print("       ORBIT VOICE SYSTEM")
    print("================================")
    print("Waiting for wake word: Orbit")
    print()

    while True:
        command = input("Say/type: ").strip().lower()

        if command == "orbit":
            activate_orbit()

        elif command in ["exit", "quit", "stop"]:
            speak("exit")
            break

        else:
            print("Waiting for Orbit...")


if __name__ == "__main__":
    main()