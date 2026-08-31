import { NotifyReminder } from "../Controller/notifyReminder.js";
import Tasks from "../Model/tasksave.js";

export const ScheduleReminder = async (task) => {
    try {

        const scheduleNext = () => {

            const now = new Date();

            // Pakistan current time
            const CurrentTime = new Date(
                now.toLocaleString("en-US", {
                    timeZone: "Asia/Karachi"
                })
            );


            // ==========================================
            // TIME PARSE
            // Supports:
            // 13:10
            // 01:10 PM
            // 01:10 AM
            // ==========================================

            let [time, period] = task.time.trim().split(" ");

            let [hours, minutes] = time.split(":");

            hours = Number(hours);
            minutes = Number(minutes);


            // AM / PM conversion
            if (period) {

                period = period.toUpperCase();

                if (period === "PM" && hours !== 12) {
                    hours += 12;
                }

                if (period === "AM" && hours === 12) {
                    hours = 0;
                }
            }


            // ==========================================
            // TARGET TIME
            // ==========================================

            const target = new Date(CurrentTime);

            target.setHours(hours);
            target.setMinutes(minutes);
            target.setSeconds(0);
            target.setMilliseconds(0);


            // ==========================================
            // If today's time has passed
            // schedule for tomorrow
            // ==========================================

            if (target <= CurrentTime) {
                target.setDate(
                    target.getDate() + 1
                );
            }


            // ==========================================
            // Calculate delay
            // ==========================================

            const delay =
                target.getTime() -
                CurrentTime.getTime();


            console.log(
                `⏰ ${task.task} scheduled at ${task.time}`
            );

            console.log(
                `⏳ Reminder in ${Math.round(delay / 1000)} seconds`
            );


            // ==========================================
            // CREATE TIMEOUT
            // ==========================================

            setTimeout(async () => {

                try {

                    console.log(
                        `🔔 Checking reminder: ${task.task}`
                    );


                    // ======================================
                    // CHECK TASK STILL EXISTS
                    // ======================================

                    const existingTask =
                        await Tasks.findById(task._id);


                    // ======================================
                    // TASK WAS DELETED
                    // ======================================

                    if (!existingTask) {

                        console.log(
                            `🗑️ Task deleted: ${task.task}`
                        );

                        console.log(
                            "⛔ Reminder stopped."
                        );

                        return;
                    }


                    // ======================================
                    // SEND REMINDER
                    // ======================================

                    console.log(
                        `🔔 Sending reminder: ${task.task}`
                    );


                    const response =
                        await NotifyReminder(existingTask);


                    // ======================================
                    // UPDATE DAILY REPORT
                    // ======================================

                    if (response?.success) {

                        await Tasks.findByIdAndUpdate(
                            existingTask._id,
                            {
                                $push: {
                                    DailyReport: {
                                        task: existingTask.task,
                                        status: "pending",
                                        date: new Date()
                                    }
                                }
                            },
                            {
                                new: true
                            }
                        );


                        console.log(
                            "📊 Daily report updated"
                        );
                    }


                    // ======================================
                    // SCHEDULE NEXT DAY
                    // ======================================

                    scheduleNext();


                } catch (error) {

                    console.error(
                        "Reminder error:",
                        error
                    );


                    // Error ke baad bhi
                    // next day schedule karo

                    scheduleNext();
                }

            }, delay);
        };


        // ==========================================
        // FIRST SCHEDULE
        // ==========================================

        scheduleNext();


    } catch (error) {

        console.error(
            "ScheduleReminder error:",
            error
        );
    }
};