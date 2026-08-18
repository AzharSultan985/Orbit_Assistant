import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
{
user:String,
orbit:String

},{
    timestamps:true
}

)
const Conversation =mongoose.model("Conversation",ConversationSchema)
export default Conversation