from langchain.tools import tool
from controller.speak import speak
import requests
url = "http://localhost:3002/api/v2/orbit/fetch-reminder"


@tool(
    description="""
   you can help in fetch all  reminder .
    use this tool when user say or ask about the task/reminder and ask for what the next or today tasks 

  your work:
   fetch and the analyiz according to user query and answer it .

"""
)

def FetchTasks ():
    try:
        print("fetchingtask/.......")
        response= requests.get(
            url,
            timeout=10
        )
        response.raise_for_status()
        print(f"response {response}")
        data=response.json()
        return data
    except requests.exceptions.RequestException as error:
        print("node  request error :",error)

