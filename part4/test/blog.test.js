const supertest = require("supertest");
const bcrypt = require("bcrypt");
const helper = require("./test_helper");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("momoto", 10);
  const user = new User({
    username: "chako",
    name: "kuboto",
    passwordHash,
  });
  await user.save();

  const blogObjects = helper.initialBlogs.map(blog => new Blog({
    title: blog.title,
    author: blog.author,
    url: blog.url,
    user: user._id,
    likes: blog.likes ? blog.likes : 0,
  }));

  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);

  user.blogs = blogObjects.map(blog => blog._id);
  await user.save();
});

describe('Blog API tests', () => {
  test('blogs are returned as JSON', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  describe("viewing a specific blog", () => {

    test("a blog cannot be added by unauthorized users", async () => {
      const newBlog = {
        title: 'frozen world',
        author: 'vamsi',
        url: 'http://www.wikipedia.com/',
        likes: 200,
      };

      await api.post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
      const titles = blogsAtEnd.map(blog => blog.title);
      expect(titles).not.toContain("frozen world");
    });


    test('new blog without title property will not be added', async () => {
      const user = {
        username: "chako",
        password: "momoto",
      };

      const loginUser = await api.post('/api/login').send(user);

      const newBlog = {
        url: 'http://www.wikipedia.com',
        author: 'vamsi',
      };

      await api.post('/api/blogs')
        .send(newBlog).set('Authorization', `Bearer ${loginUser.body.token}`).expect(400);

      const blogsAtEnd = await helper.blogsInDb();
    });


    test('new blog without url property will not be added', async () => {
      const user = {
        username: "chako",
        password: "momoto",
      };

      const loginUser = await api.post('/api/login').send(user);

      const newBlog = {
        title: 'harrypotter diary',
        author: 'mr vamsi',
      };

      await api.post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${loginUser.body.token}`)
        .expect(400);

    });
  });

  describe('deletion of a blog', () => {
   

    test('a blog can be deleted by creator', async () => {
      const user = {
        username: "chako",
        password: "momoto",
      };

      const loginUser = await api.post('/api/login').send(user);

      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${loginUser.body.token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

      const titles = blogsAtEnd.map(blog => blog.title);

      expect(titles).not.toContain(blogToDelete.title);
    });


    test("a blog cannot be deleted by unauthorized user", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

      const titles = blogsAtEnd.map(blog => blog.title);
      expect(titles).toContain(blogToDelete.title);
    });
  });

  describe('updating a blog', () => {
   
    test('the information of a blog post is updated', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      const newBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1,
      };

      await api.put(`/api/blogs/${blogToUpdate.id}`)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

      const updatedBlogInDb = blogsAtEnd.find(blog => blog.id === blogToUpdate.id);
      expect(updatedBlogInDb.likes).toBe(blogToUpdate.likes + 1);
    });
  });
});
