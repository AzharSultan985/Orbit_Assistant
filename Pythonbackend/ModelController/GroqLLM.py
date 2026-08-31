import  os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
# from langchain_core.prompts import PromptTemplate

from langchain.agents import create_agent
from ModelController.Tools.webSearch import web_search
from ModelController.Tools.whatsapp_tools import Send_Message_Tool
from ModelController.Tools.reminderSaveTool import SaveTask
from ModelController.Tools.fetchtaskTool import FetchTasks



load_dotenv()

# LLM

llm =ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0,
    api_key=os.getenv("GROQ_API_KEY")
)



# Tools/
tools =[
  web_search,
  Send_Message_Tool,
  SaveTask,
  FetchTasks
]


# Prompt

SYSTEM_PROMPT = """
You are Orbit, a personal AI assistant for Azhar.

Understand the user's request and choose the appropriate tool.

Use web_search for:
- current information
- latest news
- today's events
- current prices
- current weather
- recent technology information

Use send_whatsapp when:
- the user asks to send a WhatsApp message.

Do not call a tool unless it is necessary.

For Message:
- extract the recipient
- extract the exact message
- call send_whatsapp
- just little modify message if it make not sense otherwwise not change 

For General question
-never use any tool 
-use direct llm 



For task 
- use received task detials you send notifcation message to Azhar , write short message according to task 
After the tool completes, give a short natural confirmation.
when user say for save reminder or task you can used tool SaveTask and send just task and time in  time send in hour and mintue form like 10:30 AM/PM 
send in json like {tasks:"task note", time:"time"}



for find task and reminder 
when user ask for what the next task or what task comingup and anything ask about today task info you have access to use tool  (FetchTasks) to fetch all task and analysis and give answer, and not return all reminders/tasking list in reponse just give pending tasks . 

important Note:
 if user query come in hindi/urdu you must generate response in English/Roman urdu. can not directly urdu and hindi
"""
agent =create_agent(
  model =llm,
  tools =tools,
   system_prompt= SYSTEM_PROMPT
)


def OrbitAgent(cmd):
  try:
    response =agent.invoke(
      {
        "messages":[
{
  "role":"user",
  "content":cmd
}
          
        ]      }
    )

    return response["messages"][-1].content
  except Exception as e :
     print(f"LLM error :{e}")




# response = OrbitAgent(
#         "Send Azhar a WhatsApp message saying I will reach home at 9 "
#     )

# print("\nOrbit:")
# print(response)