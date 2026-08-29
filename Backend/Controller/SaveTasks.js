import Tasks from "../Model/tasksave.js"
import { ScheduleReminder } from "../services/Reminder.js";


export const SaveTaskController =async  (req,res)=>{

     try {
        const {payload} = req.body 

    if (!payload?.task || !payload?.time) {
      return res.status(400).json({
        success: false,
        message: "Task and time are required",
      });
    }
       const response= await Tasks.create({
            task:payload.task,
            time :payload.time
        }
        )
if(!response){
    res.status(400).send({
        success:false,
        message:"Taks do not save"
    })
}  
  ScheduleReminder(response);

res.send({success:true, message : " Tasks save successfully!"}

)

     } catch (error) {
        console.log(error)
     }
}