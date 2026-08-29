
import { NotifyReminder } from "../Controller/notifyReminder.js"
import Tasks from "../Model/tasksave.js"

export const ScheduleReminder = async (task) => {
    try {
        const scheduleNext = () => {
            const now = new Date()

            const CurrentTime = new Date(
                now.toLocaleString("en-US", {
                    timeZone: "Asia/Karachi"
                }))

            const [hours, minutes] = task.time.split(":")
            const target = new Date(CurrentTime)

            target.setHours(Number(hours))
            target.setMinutes(Number(minutes))
            target.setSeconds(0)
            target.setMilliseconds(0)


            if (target <= CurrentTime) {
                target.setDate(target.getDate() + 1)

            }
            const delay = target.getTime() - CurrentTime.getTime();

            console.log(
                `⏰ ${task.task} scheduled in ${Math.round(delay / 1000)} seconds`
            );




            setTimeout(async () => {
                try {
                    console.log("Reminder ", task.task)
                    const response = await NotifyReminder(task)
                    if (response?.success) {
                        await Tasks.findByIdAndUpdate(
                            task._id, {
                            $push: {
                                DailyReport: {
                                    task: task.task,
                                    status: "pending", date: new Date(),
                                },
                            },
                        }, { new: true }); 
                        
                        console.log("📊 Daily report updated");
                    }


                    scheduleNext()

                } catch (error) {
                    console.error(error)
                    scheduleNext()

                }
            }, delay)

        }
        scheduleNext()



    } catch (error) {
        console.log(error)
    }

}