const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { ApolloServerPluginDrainHttpServer } = require("@apollo/server/plugin/drainHttpServer");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const cors = require("cors");
const http = require("http");
const jwt = require("jsonwebtoken");
const { WebSocketServer } = require("ws");
const mongoose = require("mongoose");
const User = require("./models/user");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const { useServer } = require("graphql-ws/lib/use/ws");

require("dotenv").config();
mongoose.set("strictQuery", false);
const URI = process.env.MONGODB_URI;

mongoose
  .connect(URI)
  .then(() => console.log("connected to mongodb"))
  .catch((error) => console.error(error.message));

const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/",
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    introspection: true, // Enable introspection
  });

  await server.start();

  app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req?.headers?.authorization?.replace("Bearer", "").trim() || null;
        if (auth) {
          try {
           console.log("AUTH",auth)
            const decodeToken = jwt.verify(auth, process.env.JWT_SECRET);
           
            const currentUser = await User.findById(decodeToken.id);
            console.log(currentUser)
            if (!currentUser) {
              throw new Error('User not found');
            }
            return { currentUser };
          } catch (error) {
            console.error('Authentication error:', error);
            throw new Error('Authentication failed');
          }
        }
      },
    })
  );

  const port = 4000;
  httpServer.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/graphql`);
  });

  const gracefulShutdown = async () => {
    console.log('Shutting down server...');
    await server.stop();  // Apollo Server cleanup
    await mongoose.connection.close();  // Close MongoDB connection
    httpServer.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
};

start().catch((error) => {
  console.log("Error message:", error);
});
