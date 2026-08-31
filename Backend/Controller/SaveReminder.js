import Tasks from "../Model/tasksave.js"
import { ScheduleReminder } from "../services/Reminder.js"


export const SaveReminder = async (req, res) => {
    try {
        const task = req.body
            console.log(task)

        const savetask = await Tasks.create(
            {
                task: task.tasks,
                time: task.time
            }
        )
        if (savetask){
            res.status(200).send({
                success:true,
                message:`Azhar! ${task.task} save successfully!`
            })
            console.log(savetask)
              ScheduleReminder(savetask);
            
        }
    } catch (error) {
        console.error(error)
    }
}
