const Author = require('./models/author');
const Book = require('./models/book');
const User = require('./models/user');
const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),

    authorCount: async () => Author.collection.countDocuments(),

    allBooks: async (root, args) => {
      console.log('Query: allBooks', 'Arguments:', args);

      const authorFound = await Author.findOne({ name: args.author });
      if (args.author && args.genres) {
        return await Book.find({ author: authorFound.id, genres: { $in: args.genres } });
      } else if (args.author) {
        return await Book.find({ author: authorFound.id }).populate('author');
      } else if (args.genres) {
        return await Book.find({ genres: { $in: args.genres } }).populate('author');
      } else {
        return await Book.find({}).populate('author');
      }
    },

    allAuthors: async () => {
      console.log('Query: allAuthors');
      return Author.find({}).populate('books');
    },

    me: async (root, args, context) => {
      console.log('Query: me', 'Context:', context);
      return context.currentUser;
    },
  },

  Author: {
    bookCount: async (root) => {
      console.log('Author: bookCount', 'Root:', root);
      const foundAuthor = await Author.findOne({ name: root.name });
      const foundBooks = await Book.find({ author: foundAuthor.id });
      return foundBooks.length;
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      console.log(' addBook', args);
    
      const existAuthor = await Author.findOne({ name: args.author });
      const currentUser = context.currentUser;
    
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }
    
      if (!existAuthor) {
        const newAuthor = new Author({ name: args.author });
        try {
          await newAuthor.save();
        } catch (error) {
          throw new GraphQLError('saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args,
              error,
            },
          });
        }
      }
    
      const foundAuthor = await Author.findOne({ name: args.author });
      const book = new Book({
        ...args,
        author: foundAuthor._id,  // Ensure the author reference is set
      });
    
      try {
        await book.save();  // Save the book
        foundAuthor.books = foundAuthor.books.concat(book.id);  // Add the book to the author's books
        await foundAuthor.save();  // Save the updated author
    
        const newBook = await Book.findById(book.id).populate('author');  // Populate the author
    
        // Publish the 'BOOK_ADDED' event
        pubsub.publish('BOOK_ADDED', { bookAdded: newBook });
    
        // Return the populated book
        return newBook;  // Ensure you return the populated book
      } catch (error) {
       console.log("error::--",error)
        throw new GraphQLError('saving book failed', {
          extensions: {
            code: 'bob_USER_INPUT',
            invalidArgs: args,
            error,
          },
        });
      }
    }
    
    ,

    editAuthor: async (root, args, context) => {
      console.log('Mutation: editAuthor', 'Arguments:', args);

      const author = await Author.findOne({ name: args.name });
      const currentUser = context.currentUser;

      if (!currentUser) {
        console.log(currentUser)
        console.log("not authorized")
        throw new GraphQLError('not authorized', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (!author) {
        console.log("null")
        return null;
        
      } else {
        author.born = args.born;
        try {
          await author.save();
        } catch (error) {
          console.log("save error",error)
          throw new GraphQLError('saving born failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error,
            },
          });
        }
        return author;
      }
    },

    createUser: async (root, args) => {
      console.log('Mutation: createUser', 'Arguments:', args);

      const user = new User({
        username: args.username,
        password: args.password,
        favoriteGenre: args.favoriteGenre,
      });

      try {
        const created = await user.save();
        return created;
      } catch (error) {
        throw new GraphQLError('creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error,
          },
        });
      }
    },

    login: async (root, args) => {
      console.log('Mutation: login', 'Arguments:', args);

      const user = await User.findOne({
        username: args.username,
      });

      if (!user) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      if (user.password === args.password) {
        console.log(user.password, args.password);
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      const signed = jwt.sign(userForToken, process.env.JWT_SECRET);

      console.log('JWT Signed:', signed);

      return { value: signed };
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
  },
};

module.exports = resolvers;
