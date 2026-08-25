import Conversation from "../Model/conversation.js";



export const  Save_OrbitVoice_Msg= async (req,res)=>{
 try {
    const {type,text}=req.body

    if (!type&&!text) {
        return("type or message is invalid")
    }
    
   await Conversation.create({
        type,text
    })

res.status(200).send("message save successfully")    
 } catch (error) {
    console.log(error

    );
    
 }
}