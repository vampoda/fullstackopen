const Blog=require("../models/blog")
const User=require("../models/user")
const mongoose=require("mongoose")

const initialBlogs=[
    {
      "_id": "5a422a851b54a676234d17f7",
      "title": "The Guide",
      "author": "R.K. Narayan",
      "url": "https://en.wikipedia.org/wiki/The_Guide_(novel)",
      "likes": 15,
      "__v": 0
    },
    {
      "_id": "5a422aa71b54a676234d17f8",
      "title": "Midnight's Children",
      "author": "Salman Rushdie",
      "url": "https://en.wikipedia.org/wiki/Midnight%27s_Children",
      "likes": 20,
      "__v": 0
    },
    {
      "_id": "5a422b3a1b54a676234d17f9",
      "title": "The God of Small Things",
      "author": "Arundhati Roy",
      "url": "https://en.wikipedia.org/wiki/The_God_of_Small_Things",
      "likes": 18,
      "__v": 0
    },
    {
      "_id": "5a422bc61b54a676234d17fc",
      "title": "The Ministry of Utmost Happiness",
      "author": "Arundhati Roy",
      "url": "https://en.wikipedia.org/wiki/The_Ministry_of_Utmost_Happiness",
      "likes": 25,
      "__v": 0
    }
  ]



const nonExistingId=async()=>{
    const blog=new Blog({title:"will remove thi session"})
    await blog.save()
    await blog.deleteOne()
    return blog._id.toString()
}

const blogsInDb=async()=>{
    const blogs=await Blog.find({})
    return blogs.map(blog=>blog.toJSON())
}
const usersInDb=async()=>{
const users=await User.find({})
return users.map(user=>user.toJSON())
}



module.exports={
    initialBlogs,nonExistingId,blogsInDb,usersInDb
}