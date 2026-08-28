
import { NotifyReminder } from "../Controller/notifyReminder.js"
import Tasks from "../Model/tasksave.js"

export const Reminder=async ()=>{
try {
    
const tasks= await Tasks.find()
const now =new Date()
  // Pakistan time (UTC + 5)
    const pakistanNow = new Date(
      now.toLocaleString("en-US", {
        timeZone: "Asia/Karachi",
      })
    );

    const currentHours = String(pakistanNow.getHours()).padStart(2, "0");
    const currentMinutes = String(pakistanNow.getMinutes()).padStart(2, "0");

    const currentTime = `${currentHours}:${currentMinutes}`;
for(const task of tasks){
console.log(now);
const lastIndex = task.DailyReport.length - 1;
const lastReport = task.DailyReport[lastIndex]

    if(task.time <=currentTime && lastReport.status ==="pending"){
        const response = await  NotifyReminder(task)
        if (response && response.success){
         await Tasks.updateOne(
            {_id:task._id},
            {
                $set:{
                    [`DailyReport.${lastIndex}.status`]:"confirmed"
                }
            }
         )
        }

    }
console.log(`Task ${task._id} marked as confirmed.`);

}
 




} catch (error) {
    console.log(error)
}

}