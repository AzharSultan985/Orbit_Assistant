import express from 'express'
import SystemRoutes from "./Routes/SystemRoute.js";
import cors from "cors";
const app=express()

app.use(express.json());
app.use(
  cors({
    origin: true,
  })
);
app.get("/", (req, res) => {
  res.send("Backend running");
});
app.use("/api/v1", SystemRoutes);





const PORT=3002
app.listen(PORT,()=>{
console.log("Server is runing");

})