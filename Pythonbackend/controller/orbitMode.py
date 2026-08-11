import requests


async def OrbitMode(mode):

    try:
        print(f"Mode: {mode}")

        requests.post(
            "http://localhost:3002/api/v2/orbit/mode",
            json={
                "mode": mode
            },
            timeout=2
        )

    except requests.exceptions.RequestException as e:

        print(f"Orbit mode error: {e}")