import mongoose from 'mongoose'

const TaskSchema = mongoose.Schema({

    task: String,
    time: String


}, {
    timestamps: true

})

const Tasks = mongoose.model("Tasks", TaskSchema)

export default Tasks