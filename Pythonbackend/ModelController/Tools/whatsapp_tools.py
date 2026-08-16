from langchain.tools import tool
from controller.message import send_whatsapp_message


@tool(
    description="""
    you help in  contact extraction for Send a WhatsApp message to a specific recipient.

    Use this tool when the user asks Orbit to send a WhatsApp message.

    recipient:
    The WhatsApp contact name or phone number.

    message:
    The exact message that should be sent.
    """
)

def Send_Message_Tool(reception:str , message:str)->str:
    result=send_whatsapp_message(reception,message)
    if result :
      return f"message successfully sent to {reception}"
    return f"Failed to send WhatsApp message to {reception}."