import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from controller.orbit_log import orbit_log

app = FastAPI()

# Shared state
mic_enabled = True


class MicRequest(BaseModel):
    enabled: bool


@app.get("/")
async def root():
    return {
        "success": True,
        "message": "Orbit Python server running"
    }


@app.post("/api/mic")
async def is_mic(data: MicRequest):
    global mic_enabled

    mic_enabled = data.enabled

    orbit_log("MIC ON" if mic_enabled else "MIC OFF")

    return {
        "success": True,
        "micEnabled": mic_enabled
    }


def start_server():
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=5000,
        reload=False
    )