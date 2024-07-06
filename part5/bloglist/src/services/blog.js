import axios from "axios"
const baseUrl="http://localhost:4000/api/blogs"
let token =null;
const setToken=newToken=>{
    token=`Bearer ${newToken}`
}
const getAll=async()=>{
    const request= await axios.get(baseUrl)
    const response=await request.data
    return response

}
    
const create=async (newObject)=>{


    const config={
        headers:{Authorization:token}
    }
    const response=await axios.post(baseUrl,newObject,config)

return response.data

}

const update=async(id,newObject)=>{

try{
    const config={
        headers:{Authorization:token}
    }
    const response=await axios.put(`${baseUrl}/${id}`,newObject,config)
return response.data

}catch(error){
console.error("error updating",error)
throw error
}
}
const remove=async(id)=>{
    const config={
        headers:{Authorization:token}
    }
    try{
    const response=await axios.delete(`${baseUrl}/${id}`,config)
return response.data
    }catch(error){
console.error("error deleting",error)
throw error

    }
};
export default {getAll,create,setToken,update,remove}