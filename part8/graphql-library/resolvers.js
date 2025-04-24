import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'
import { PubSub } from 'graphql-subscriptions'
import Book from './models/book.js'
import Author from './models/author.js'
import User from './models/user.js'

const pubsub = new PubSub()

const resolvers = {
  Query: {
    allAuthors: async () => {
        const authors = await Author.find({})
        const books = await Book.find({}).populate('author')
      
        const bookCounts = books.reduce((acc, book) => {
          const authorId = book.author._id.toString()
          acc[authorId] = (acc[authorId] || 0) + 1
          return acc
        }, {})
      
        return authors.map(author => ({
          ...author.toObject(),
          bookCount: bookCounts[author._id.toString()] || 0
        }))
      },
    allBooks: async (root, args) => {
      if (!args.genre) return Book.find({}).populate('author')
      return Book.find({ genres: { $in: [args.genre] } }).populate('author')
    },
    me: (root, args, context) => context.currentUser,
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        })
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }

      const book = new Book({ ...args, author: author._id })
      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Failed to add book', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error
          }
        })
      }

      const populatedBook = await book.populate('author')
      pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook })
      return populatedBook
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) return null
      author.born = args.setBornTo
      await author.save()
      return author
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })
      return user.save().catch(error => {
        throw new GraphQLError('Creating user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error
          }
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('Invalid credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
}

export default resolvers
