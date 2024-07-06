import { useState,useEffect,useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notifications'
import BlogForm from './components/BlogForm'
import Togglable from './components/Toggable'
import loginService from './services/login'
import blogService from "./services/blog"
import "./index.css"
const  App=()=> {
   const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({})
  const [refreshBlog, setRefreshBlog] = useState(false)
  const blogFormRef = useRef()

  useEffect(()=>{
  blogService.getAll().then(blogs=>{
    blogs.sort((a,b)=>b.likes-a.likes)
setBlogs(blogs)
  })
},[refreshBlog])

useEffect(()=>{
  const loggedInUser=window.localStorage.getItem("user")

if(loggedInUser){
  const user=JSON.parse(loggedInUser)
  setUser(user)
blogService.setToken(user.token)

}
},[])

const handleLogin = async (event) => {
  event.preventDefault()

  try {
    const user = await loginService.login({
      username, password,
    })

    window.localStorage.setItem(
      'user', JSON.stringify(user)
    )
blogService.setToken(user.token)
setUser(user)
setUsername("")
setPassword("")

  }catch(error){
    setMessage({message:"invalid user name or password",type:"error"})
    console.error(error.message)
setTimeout(()=>{
  setMessage(null)
},5000)
  }

}
const handleLogout=()=>{
  window.localStorage.clear()
  setUser(null)
}
const addBlog=(blogObject)=>{
  blogFormRef.current.toggleVisibility()
    try{
      blogService.create(blogObject).then(returnBlog=>{
        setBlogs(blogs.concat(returnBlog))
        setMessage(`the new blog ${blogObject}`)
    setRefreshBlog(!refreshBlog)
    setTimeout(()=>{
      setMessage(null)
    
    },5000)})
  }catch(error){
    
    
      console.error("error when ading blog",error)
      setMessage({message:"failed to add blog.please try again",type:"error"})
    setTimeout(()=>{
      setMessage(null)
    },5000)
    }
    
}
const addLikes=async(id,blogObject)=>{
  console.log("id:",id)
  console.log("objects",blogObject)
  await blogService.update(id,blogObject)
  setRefreshBlog(!refreshBlog)
}
const deleteBlog=async id=>{
  await blogService.remove(id)
  setRefreshBlog(!refreshBlog)
}
if(user===null){
  return(
    <div>
      <h2>log in to application</h2>
  <Notification message={message}></Notification>
   <form onSubmit={handleLogin}>

<div>
  username:
  <input type="text"
  name='name'
  value={username}
  onChange={(event)=>setUsername(event.target.value)}

  className='username'
  />

</div>
<div>
  password
<input type="password"
value={password}
name='password'
className='password'
onChange={(event)=>setPassword(event.target.value)}
/>
</div>


<button className='login' type='submit' >login</button>

   </form>
    </div>
  )
}

  return (
    <>
<div>
    <h1>blogs</h1>
    <Notification message={message}></Notification>
 <p>{user.name}</p>
 <button type='submit' className='logout' onClick={handleLogout}>logout</button>
 <Togglable buttonLabel="create new blog" ref={blogFormRef}>
  <BlogForm createBlog={addBlog}></BlogForm>
 </Togglable>
   {blogs.map(blog=><Blog key={blog.id} blog={blog} addLikes={addLikes} deleteBlog={deleteBlog} user={user}></Blog>)}
   </div>
    </>
  )
}

export default App
