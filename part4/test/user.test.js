const supertest = require("supertest");
const bcrypt = require("bcrypt");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("momoto", 10);
  const user = new User({
    username: "chakolate",
    name: "kuboto",
    blogs: [],
    passwordHash,
  });
  await user.save();
});

describe('User API tests', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'vampo',
      name: 'vam',
      password: '123456',
    };

    await api.post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(user => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper status code and message if username does not exist', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: 'vam',
      password: '123456',
    };

    await api.post('/api/users')
      .send(newUser)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  // Add more tests related to user operations as needed
});
