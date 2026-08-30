import Tasks from "../Model/tasksave.js"
import { ScheduleReminder } from "../services/Reminder.js"


export const SaveReminder = async (req, res) => {
    try {
        const task = req.body

        const savetask = await Tasks.create(
            {
                task: task.task,
                time: task.time
            }
        )
        if (savetask){
            res.status(200).send({
                success:true,
                message:`Azhar! ${task.task} save successfully!`
            })
              ScheduleReminder(response);
            
            console.log(savetask)
        }
    } catch (error) {
        console.error(error)
    }
}
