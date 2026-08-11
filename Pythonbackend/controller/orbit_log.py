import requests

NODE_LOG_URL = "http://127.0.0.1:3002/api/v2/orbit/log"


def orbit_log(message):
    message = str(message)

    # Show in Python terminal
    print(message, flush=True)

    # Send to Node
    try:
        requests.post(
            NODE_LOG_URL,
            json={
                "message": message
            },
            timeout=1
        )
    except requests.RequestException:
        # Node may not be running; don't stop Orbit
        pass