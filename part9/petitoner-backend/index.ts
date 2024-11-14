const express = require('express');
const cors = require('cors');


import diagnosesRouter  from "./routes/diagnoses"
import patientsRouter from "./routes/patients"


const app=express()

app.use(cors())
app.use(express.json())
const PORT=80;

app.get("/api/ping",(_req,res)=>{
    res.send("pong")
})
app.use("/api/diagnose",diagnosesRouter)
app.use("/api/patients",patientsRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})