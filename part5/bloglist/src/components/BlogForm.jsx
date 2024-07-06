import {useState} from "react"
const BlogForm=({createBlog})=>{
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
  
   
  const handleTitleChange=(event)=>{
    setTitle(event.target.value)
  }

  const handleAuthorChange=(event)=>{
    setAuthor(event.target.value)
  }
  const handleUrlChange=(event)=>{
    setUrl(event.target.value)
  }

const addBlog=async (event)=>{
  event.preventDefault()
  try{
  createBlog(
    {
    title:title,
    author:author,
    url:url
    }
  )
  setTitle("")
  setAuthor("")
  setUrl("")  

}
catch(error){
  console.error(error);
}
}
return(
    <>
    <h1>create new blog</h1>
    <form onSubmit={addBlog}>
        <div>
        title:
        <input type="text" 
        value={title}
        onChange={handleTitleChange}
        name="title"
        placeholder="title of blog"
        className="title"
        />
        </div>
    
        <div>
        Author:
        <input type="text" 
        value={author}
        name="author"
        onChange={handleAuthorChange}
        placeholder="author name"
        className="author"
        />
        </div>
    
        <div>
        Url:
        <input type="url" 
        value={url}
        onChange={handleUrlChange}
        name="url"
        placeholder="url of blog"
        className="url"
        />
        </div>
        <button type="submit" className="create-button">Create</button>
    </form>
    </>
);

}
export default BlogForm