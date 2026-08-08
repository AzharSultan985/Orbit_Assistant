import express from 'express'
import SystemRoutes from "./Routes/SystemRoute.js";

const app=express()

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running");
});
app.use("/api", SystemRoutes);





const PORT=3002
app.listen(PORT,()=>{
console.log("Server is runing");

})