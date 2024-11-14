const express = require('express');

import patientService from "../services/patientService";
import toNewPatient from "../utils/toNewPatients";
import toNewEntry from "../utils/toNewEntry"



const router=express.Router()
router.get("/",(_req,res)=>{
    res.send(patientService.getPatient())
});

router.get("/:id",(req,res)=>{
    res.send(patientService.getPatientForOne(req.params.id))

})
router.post("/",(req,res)=>{
    try{
        const newPatient=toNewPatient(req.body)
        const addPatient=patientService.addPatient(newPatient)
        res.json(addPatient)

    }catch(error:unknown){
        let errorMessage="Something went wrong.";
        if(error instanceof Error){
            errorMessage +=" Error:"+error.message

        }
res.status(400).send(errorMessage)

    }
})


router.post("/:id/entries",(req,res)=>{
    try{
        const patient=patientService.getPatientForOne(req.params.id)
        if(patient===undefined){
            res.status(404).send("patient not found")
            return;
        }
        const newEntry=toNewEntry(req.body);
        const addedEntry=patientService.addEntry(patient,newEntry)
res.json(addedEntry)

    }catch(error:unknown){
        let errorMessage= "Something went wrong";
        if(error instanceof Error){
            errorMessage +="Error"+ error.message
        }
res.status(400).send(errorMessage)

    }
})

export default router;
