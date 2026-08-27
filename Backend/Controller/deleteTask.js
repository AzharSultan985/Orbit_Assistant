import Tasks from "../Model/tasksave.js"

export const DeleteTaskController = async (req,res)=>{

    try {
        const taskid = req.params.id
        const response =await  Tasks.findByIdAndDelete(taskid)
    if (!response ) {
        return res.send ({
            success:false,
            message :"failed to delete task"
        })
    }
return res.send ({
            success:true,
            message :"Task deleted successfully!"
        })
    } catch (error) {
        console.log(error)
    }
}