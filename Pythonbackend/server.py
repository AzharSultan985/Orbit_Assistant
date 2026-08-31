import uvicorn
from fastapi import FastAPI,HTTPException
from pydantic import BaseModel
from controller.orbit_log import orbit_log
from ModelController.GroqLLM import OrbitAgent
from controller.speak import speak
app = FastAPI()

# Shared state
mic_enabled = True


class MicRequest(BaseModel):
    enabled: bool


class TaskRequest(BaseModel):
    task: str
    time: str

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


@app.post("/api/v2/orbit/notify")
async def NotifyReminder(data:TaskRequest):
    try:
        # Convert Pydantic object to a standard Python dict
        print(f"Processing task: {data.task} at {data.time}")

        # If OrbitAgent is an async function, use 'await OrbitAgent(task_dict)'
        # If it is synchronous, call it directly:
 
        prompt_text = f"Reminder Alert: The user has scheduled task '{data.task}' at time '{data.time}'. Please notify the user via whatsapp mesage to Azhar and also return third parameter iscall=true"
        response = OrbitAgent(prompt_text)
        if(response):
            await speak(f"Azhar! It's your time for your task {data.task} ") 
            return {
                "success": True,
                "message": "Reminder processed successfully"
            }
        
    except Exception as e:
        print(f"Error executing OrbitAgent: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    
def start_server():
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=5000,
        reload=False
    )