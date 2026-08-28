import mongoose from 'mongoose'

const TaskSchema = mongoose.Schema({
    task: String,
    time: String,
    DailyReport:[
        {
        task :String,
        status : {type:"String",default:"pending"},
        date: { type: String, },
    }]


}, {
    timestamps: true

})

const Tasks = mongoose.model("Tasks", TaskSchema)

export default Tasks
