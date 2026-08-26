import requests

NODE_URL="http://localhost:3002/api/v2/orbit/message-save"



def Node_Mess_save (cmd:str, type:str ="user"):
    if not cmd or not  cmd.strip():
        return None


    payload={
        "type":type,
        "text":cmd.strip()
    }

    print(payload)
    try:
        response= requests.post(
            NODE_URL,
            json=payload,
            timeout=10
        )
        response.raise_for_status()
        data= response.json()
        print("node response",data)


    except requests.exceptions.RequestException as error:
        print("node  request error :",error)
        
