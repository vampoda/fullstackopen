import axios from "axios"
const baseUrl="http://localhost:3000/persons/"


const getAll=async ()=>{
    
    try{
    const request= await axios.get(baseUrl)
    let data=await request.data
    return data
    }catch(err){
        console.log(err)
        throw err
    }
}
const create= async(newObject)=>{
    console.log(newObject)

    try{
    const  request=await axios.post(baseUrl,newObject)
    let data=await request.data
    return data

    }catch(err){
        console.log(err)
        throw err()
    }
}
const updatePerson = async (id, newObject) => {
 console.log(id,newObject)
 
    try{
    
    const request = await axios.put(`${baseUrl}${id}`, newObject)
    
    let data=await request.data
    console.log(data)
    return data


}catch(err){
        console.log(err)
        throw err()
    }
}
const deletePerson = async(id) => {
console.log(typeof id)
    try{
    const request =await  axios.delete(`${baseUrl}${id}`)

    let data=await request.data
   console.log(data)
    return data

    }catch(err){
        console.log(err)
        throw err()
    }
}
const personServices={getAll,create,updatePerson,deletePerson}
export default personServices;