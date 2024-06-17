const express=require("express")
const app=express()
const morgan=require("morgan")
const cors=require("cors")
const Person=require("./models/persons")
const dotenv=require("dotenv")
dotenv.config()
app.use(cors())
morgan.token("body",(request)=>JSON.stringify(request.body))
app.use(express.json())
app.use(morgan("tiny"))
app.use(express.static("build"))

app.get("/api/persons",(request,response,next)=>{
    console.log(request)


    Person.find({}).then(result=>{
        response.json(result)
    }).catch(error=>console.log(error))
})

app.get("/Info",(request,response,next)=>{
    console.log(request)

    const  date=new Date()
    Person.find({}).then(result=>{
        response.send( `<p>Phonebook has info for ${result.length} persons</p>
            <br>
            <p>${date}</p>`)
    }).catch(error=>next(error))

})



app.get("/api/persons/:id",(request,response,next)=>{
    console.log(request)

    Person.findById(request.params.id).then(person=>{
        if(person){
            response.json(person)
        }else{
            response.status(404).end
        }
    }).catch(error=>next(error))
})


app.delete("/api/persons/:id",(request,response,next)=>{
    Person.findByIdAndDelete(request.params.id).then(
        ()=>{
            response.status(204).end()

        }
    ).catch(error=>next(error))
})



//const postMorgan=morgan(":method :url :status :res[content-length]-:response-time ms :body")
app.post("/api/persons",(request,response,next)=>{
    const body=request.body
    console.log(body)
    if(!body.name || !body.number){
        return response.status(404).json({error:"usernameor number missing"})

}

else{
    const person=new Person({
        name:body.name,
        number:body.number
    })
    person.save().then(person=>{
        response.json(person)
    }).catch(err=>next(error))

}
})

app.put('/api/persons/:id', (request, response, next) => {

    const { name, number } = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))

})


const unknownEndpoint=(request,response)=>{

    response.status(404).send({error:"unknown endpoint"})


}
app.use(unknownEndpoint)
const errorHandler=(error,request,response,next)=>{
    console.error(error)

if(error.name==="CastError"){
    return response.status(400).send({error:"malformatted id"})
}else if(error.name== "ValidationError"){
    return response.status(400).json({error:error.message})
}
next(error)
}
app.use(errorHandler)

const port=process.env.PORT||3000

app.listen(port,()=>{

    console.log(`server runnng on http://localhost:${port}`)
})
