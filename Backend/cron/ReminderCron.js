import cron from 'node-cron'
import { Reminder } from '../services/Reminder.js';

cron.schedule("* * * * *", async ()=>{
    try {
        console.log("checking orbit reminder");
        await Reminder()
        
    } catch (error) {
        console.error(error)
    }
})