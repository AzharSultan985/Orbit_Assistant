import requests

NODE_URL = "http://localhost:3002/api/v1/orbit/cmd"


def ask_ollama(command):

    try:

        print("Sending command to Node backend...")

        response = requests.post(
            NODE_URL,
            json={
                "command": command
            },
            timeout=60
        )

        response.raise_for_status()

        data = response.json()

        answer = data.get(
            "response",
            ""
        ).strip()

        if not answer:
            print("Node returned empty response.")
            return None

        print(f"ORBIT AI: {answer}")

        return answer

    except requests.exceptions.Timeout:

        print("Node backend request timed out.")

        return "Sorry, I took too long to respond."

    except requests.exceptions.ConnectionError:

        print("Cannot connect to Node backend.")

        return "I cannot connect to the backend."

    except requests.exceptions.RequestException as e:

        print(
            f"Backend request error: {e}"
        )

        return "I could not process your request."

    except Exception as e:

        print(
            f"Unexpected error: {e}"
        )

        return "Sorry, something went wrong."