import axios from "axios"

export const NotifyReminder =async (task)=>{
try {
    console.log(task)



const response = await axios.post("http://127.0.0.1:5000/api/v2/orbit/notify",{
    task:task.task,
    time:task.time
},{
    timeout:5000
})


if(response.success){
    console.log("notifes success")
}



} catch (error) {
    console.log(error)
}

}