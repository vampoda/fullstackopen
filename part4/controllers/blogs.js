const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const mongoose = require("mongoose")
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const { response, json } = require("express")
const { error } = require("../utils/logger")


blogsRouter.get("/", async (req, res) => {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1, id: 1 })
    res.status(200).json(blogs)
})
blogsRouter.get("/:id", async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid blog id" });
    }

    try {
        const blog = await Blog.findById(id);

        if (blog) {
            res.status(200).json(blog);
        } else {
            res.status(404).json({error:"not found"});
        }
    } catch (error) {
        console.error("Error fetching blog:", error);
        res.status(500).json({ error: "Failed to fetch blog" });
    }
});

blogsRouter.post("/", async (req, res) => {
    const { title, author, url, likes } = req.body
    const user = req.user
    console.log(req, req.body, req.user)


    if (!user) {
        return res.status(401).json({ error: "token mising or invalid" })
    }
    else if (title === undefined || url === undefined) {
        return res.status(400).json({ error: "title or url mising" })

    }


    const blog = new Blog({
        title: title,
        author: author,
        url: url,
        likes: likes===undefined?0:likes,
        user: user.id
    })


    const savedBlog = await blog.save()


    if (!user) {
        user.blogs = user.blogs.concat(savedBlog._id);

        await user.save();
    


    }
    console.log("sent response success")

    return res.status(201).json(savedBlog);


})

blogsRouter.delete("/:id", async (req, res) => {
    const user = req.user
    if (!user) {
        return res.status(401).json({ error: "token missing or invalid" })
    }
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
        return res.status(404).json({ error: "blog not found" })
    }

    if (blog.user.toString() !== req.user.id) {
        return res.status(401).json({ error: "unauthorized to delete the blog" })


    } else {
        await Blog.findByIdAndDelete(req.params.id)
        res.status(204).json({message:"succesfully deleted"})
    }
})


blogsRouter.put("/:id", async (req, res) => {
    const { title, author, url, likes } = req.body

    try {
        const blog = {
            title,
            author,
            url,
            likes
        }
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true });


        res.status(200).json(updatedBlog)
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ error: error })
    }
})


module.exports = blogsRouter