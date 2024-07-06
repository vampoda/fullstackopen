
import { useState } from "react";
const Blog=({blog,addLikes,deleteBlog,user})=>{
console.log(`blog: ${[blog]} ,user:${[user]}`)

console.log(blog)
const [visible,setVisible]=useState(false)


const toggleVisibility=()=>{
    setVisible(!visible)
}
const handleLikes=()=>{
    const updateBlog={
         ...blog,likes:blog.likes?blog.likes+1:1,     
    }
    addLikes(blog.id,updateBlog)
}
const handleDelete=()=>{
    if(window.confirm(`remove the blog ${blog.title} by ${blog.author}`)){
        deleteBlog(blog.id)
    }
}
const showDelete=blog.user?.name===user.name?true:false

return(

   <>

   <div style={blogStyle} className="blog">
    <div style={{display:visible?"none":""}}>
    <p>{blog.title}</p>
    <p>{blog.author}</p>

    <button className="view" onClick={toggleVisibility}>{visible?"hide":"view"}</button>
    </div>
    {visible && (
        <div>
            {`${blog.title}  ${blog.author}`}
            <button onClick={toggleVisibility}>hide</button>
            <p>{blog.url}</p>
        <button className="likes" onClick={handleLikes}>{`${blog.likes} likes`}</button>
        
       <p>{blog.username}</p>
        {showDelete && <button className="remove" onClick={handleDelete}>remove</button>}
        </div>
    )}
   </div>

</>

)
}
const blogStyle={
    border:"1px solid",
    marginBottom:"5px",
    padding:"10px 2px"
}
export default Blog