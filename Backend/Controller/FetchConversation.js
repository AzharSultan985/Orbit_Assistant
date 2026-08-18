import Conversation from "../Model/conversation.js"

export const FetchConversation =async (req,res)=>{
try {
    const conversation = await  Conversation.find();
    if (!conversation) {
    res.status(404).json({
        success:false,
        message:"failed to fetch history"
    })
    }

       res.status(200).json({
        success:true,
        history:conversation
    })

} catch (error) {
    console.error(error

    )
}    
}
