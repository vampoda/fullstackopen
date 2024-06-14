const Header=({name})=>{
    console.log(name)
    return(
        <div>
            <h1>{name}</h1>
        </div>
    )
}

const Part=({parts})=>{
    console.log(parts)

    return(
        <div>
            <p>{parts.name} {parts.exercises}</p>
        </div>
    )
}

const content=({parts})=>{
    const differentParts=parts.map(element=>(
        <Part key={element.id} parts={element}></Part>
    ))
return(
    <div>
        {differentParts}
    </div>
)    

}

const Total=({parts})=>{
    const totalAmount=parts.reduce((sum,order)=>sum+order.exercises,0)
console.log(totalAmount)
return(
    <div>
        <p>
            total of {totalAmount} exercise
        </p>
    </div>
)

}



const Course=({course})=>{

    console.log(course)
return(
    <div>
<Header name={course.name}/>
<content parts={course.parts}/>
<Total parts={course.parts}/>
    </div>
)

}


export default Course;