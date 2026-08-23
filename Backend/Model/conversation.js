import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
{
type:{
    type:String,
    enum:["user","orbit"]
},

text:String
},{
    timestamps:true
}

)
const Conversation =mongoose.model("Conversation",ConversationSchema)
export default Conversation