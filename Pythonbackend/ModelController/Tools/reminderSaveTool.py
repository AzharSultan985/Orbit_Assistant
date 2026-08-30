from langchain.tools import tool
from controller.speak import speak
import requests
url = "http://localhost:3002/api/v2/orbit/save-reminder"


@tool(
    description="""
    you can help in save reminder .
    use this tool when user say to save the task/reminder 

  your work:
   return a just return a task and time in json .

"""
)

def SaveTask (task):
    try:
        response= requests.post(
            url,
            json=task,
            timeout=10
        )
        response.raise_for_status()
        print(f"response {response}")
        data=response.json()
        speak(data.message)

    except requests.exceptions.RequestException as error:
        print("node  request error :",error)

