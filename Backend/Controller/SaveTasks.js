import Tasks from "../Model/tasksave.js"


export const SaveTaskController =async  (req,res)=>{

     try {
        const {payload} = req.body 

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
res.send({success:true, message : " Tasks save successfully!"}

)

     } catch (error) {
        console.log(error)
     }
}