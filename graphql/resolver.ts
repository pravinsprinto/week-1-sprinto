import { Book } from "../models/Book";
import { Book as BookType } from "./types";
import { generateToken, authenticateUser } from "../lib/auth";
import { BookInput, LoginUserInput, MutationResolvers, QueryResolvers, ReviewInput, UserInput } from './types';
import { Op, Order } from 'sequelize';
import { User } from "../models/User";
import { Review } from "../models/Review";

const getBookTotalReviews = async (books: BookType[] | null) => {
  if (!books) return;
  books.forEach(async (book) => {
    const totalReviews = await Review.countDocuments({ bookId: book.id });
    book.totalReviews = totalReviews;
  });
  return books;
}

const Query: QueryResolvers = {
  books: async (_: unknown, args: {
    filter?: { searchTerm?: string, filterBy?: string, startDate?: string, endDate?: string },
    limit?: number,
    offset?: number
  }) => {
    const filter = args.filter;
    const whereClause: any = {};
    const includeOptions: any = [{ model: User }];

    if (filter) {
      // Filter by title
      if (filter.filterBy === 'title' && filter.searchTerm) {
        whereClause.title = { [Op.iLike]: `%${filter.searchTerm}%` };
      }

      // Filter by date range
      if (filter.filterBy === 'date' && filter.startDate && filter.endDate) {
        whereClause.publishedDate = { [Op.between]: [new Date(filter.startDate).toISOString(), new Date(filter.endDate).toISOString()] };
      }

      // Filter by author; we apply where clause to the Author table
      if (filter.filterBy === 'author' && filter.searchTerm) {
        includeOptions[0].where = {
          name: { [Op.iLike]: `%${filter.searchTerm}%` }
        };
      }
    }

    let [books, total] = await Promise.all([
      Book.findAll({
        where: whereClause,
        include: includeOptions,
        limit: args.limit || 10,
        offset: args.offset || 0
      }),
      Book.count({ where: whereClause })
    ]);
    const booksWithTotalReviews:BookType[] = await Promise.all(books.map(async (book:Book) => {
      const totalReviews = await Review.countDocuments({ bookId: book.id });
      const newbook:BookType = book as BookType;
      newbook.totalReviews = totalReviews;
      return newbook;
    }));
    return {
      books: booksWithTotalReviews,
      total
    };
  },
  book: async (_: unknown, args: { id: number }) => {
    let books = await Book.findByPk(args.id, { include: [{ model: User, as: 'author' }] });
    let newbook:BookType = books as BookType;
    const totalReviews = await Review.countDocuments({ bookId: args.id });
    newbook.totalReviews = totalReviews;  
    return newbook;
  },
  myBooks: async (_: unknown, { limit = 10, offset = 0, sort }, context: { user: User }) => {
    if (!context.user) {
      throw new Error('Authentication required');
    }
    const order: Order = sort ? [[sort.field, sort.order]] : [['createdAt', 'DESC']];

    const [books, total] = await Promise.all([
      Book.findAll({
        where: { authorId: context.user.id },
        include: [{ model: User, as: 'author' }],
        limit,
        offset,
        order
      }),
      Book.count({ where: { authorId: context.user.id } })
    ]);

    const booksWithTotalReviews:BookType[] = await Promise.all(books.map(async (book:Book) => {
      const totalReviews = await Review.countDocuments({ bookId: book.id });
      const newbook:BookType = book as BookType;
      newbook.totalReviews = totalReviews;
      return newbook;
    }));

    return {
      books: booksWithTotalReviews,
      total
    };
  },
  user: async (_: unknown, _args: unknown, context: { user: User }) => {
    if (!context.user) return null;
    return context.user;
  },
  bookReviews: async (_: unknown, args: { bookId: number, limit: number, offset: number }) => {
    const reviews = await Review.find({
      bookId: args.bookId
    })
      .sort({ createdAt: -1 })
      .skip(args.offset)
      .limit(args.limit)
      .exec();
    const users = await User.findAll({
      where: {
        id: {
          [Op.in]: reviews.map(review => review.userId)
        }
      }
    });
    reviews.map(review => {
      const user = users.find(user => user.id === review.userId);
      review.user = user;
    });
    const total = await Review.countDocuments({ bookId: args.bookId });
    const hasMore = args.offset + args.limit < total;

    return {
      reviews,
      total,
      hasMore
    };
  }
}

const Mutation: MutationResolvers = {
  createBook: async (_: unknown, args: { bookInput: BookInput }, context: { user?: User }) => {
    if (!context.user || !context.user.isAuthor) {
      throw new Error('Only authors can create books');
    }
    try {
      args.bookInput.authorId = context.user ? context.user.id : 2;
      const book = await Book.create(
        { ...args.bookInput },
        {
          returning: true,
          include: [{ model: User, as: 'author' }],
        }
      );
      const updatedBook = await Book.findByPk(book.id, { include: [{ model: User, as: 'author' }] });
      const totalReviews = await Review.countDocuments({ bookId: book.id });
      const newbook:BookType = updatedBook as BookType;
      newbook.totalReviews = totalReviews;
      return newbook;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  updateBook: async (_: unknown, args: { id: string, bookInput: BookInput }, context: { user: User }) => {
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const book = await Book.findByPk(args.id, { include: [{ model: User, as: 'author' }] });
    if (!book) {
      throw new Error('Book not found');
    }

    if (book.authorId !== context.user.id) {
      throw new Error('Not authorized to update this book');
    }

    try {
      await book.update({
        ...args.bookInput,
        publishedDate: new Date(args.bookInput.publishedDate)
      });
      // Fetch the updated book with author information
      const updatedBook = await Book.findByPk(book.id, { include: [{ model: User, as: 'author' }] });
      const totalReviews = await Review.countDocuments({ bookId: book.id });
      const newbook:BookType = updatedBook as BookType;
      newbook.totalReviews = totalReviews;
      if (!updatedBook) throw new Error('Failed to fetch updated book');
      return newbook;
    } catch (error) {
      console.error('Update error:', error);
      throw new Error('Failed to update book');
    }
  },
  deleteBook: async (_: unknown, args: { id: string }, context: { user: User }) => {
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const book = await Book.findByPk(args.id);
    if (!book) {
      throw new Error('Book not found');
    }

    if (book.authorId !== context.user.id) {
      throw new Error('Not authorized to delete this book');
    }
    await Review.deleteMany({ bookId: args.id  });
    await book.destroy();
    return {
      success: true,
      message: 'Book deleted successfully',
    };
  },
  createReview: async (_, { reviewInput }, { user }) => {
    if (!user) {
      throw new Error('You must be logged in to write a review');
    }

    const book = await Book.findByPk(reviewInput.bookId);

    if (!book) {
      throw new Error('Book not found');
    }

    // Check if user has already reviewed this book
    const existingReview = await Review.findOne({
      bookId: reviewInput.bookId,
      userId: user.id
    });

    if (existingReview) {
      throw new Error('You have already reviewed this book');
    }

    // Create review
    const review = await Review.create({
      ...reviewInput,
      userId: user.id,
      createdAt: new Date()
    });
    await review.save();

    // Calculate new average rating
    Review.aggregate([
      { $match: { bookId: reviewInput.bookId } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } }
    ]).then((reviews: any) => {
      console.log(reviews);
      if (reviews.length > 0) {
        book.update({ averageRating: reviews[0].averageRating });
      }
    });
    return review;

  },
  signup: async (_: unknown, args: { userInput: UserInput }) => {
    const user = await User.create(args.userInput, { include: [Book] });
    return {
      user,
      token: generateToken(user),
    };
  },
  login: async (_: unknown, args: { loginUserInput: LoginUserInput }) => {
    const user = await User.findOne({
      where: { email: args.loginUserInput.email },
      include: [Book]
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await user.validatePassword(args.loginUserInput.password);
    if (!isValid) {
      throw new Error('Invalid password');
    }

    return {
      user,
      token: generateToken(user)
    };
  }
}
export const resolvers = {
  Query,
  Mutation
};
