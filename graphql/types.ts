import { Book as BookModel } from '../models/Book';
import { User as UserModel } from '../models/User';
import { CreationAttributes } from 'sequelize';
import { DeleteResponse } from './generated';         

export type Book = BookModel & { totalReviews: number };
export type User = UserModel;

export interface PaginatedBooks {
  books: Book[];
  total: number;
}

export interface BookInterFace {
  id: number;
  title: string;
  description: string;
  image: string;
  publishedDate: Date;
}

export interface UserInterface {
  id: number;
  name: string;
  email: string;
  biography?: string;
  bornDate: Date;
  password: string;
  profilePicture?: string;
  isAuthor: boolean;
}

export interface BookInput extends Omit<BookInterFace, 'id'>, CreationAttributes<BookModel> {}

export interface UserInput extends Omit<UserInterface, 'id'>, CreationAttributes<UserModel> {}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user?: User;
  token: string;
}

export interface BookFilterInput {
  searchTerm?: string;
  filterBy?: string;
  startDate?: string;
  endDate?: string;
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export interface SortInput {
  field: string;
  order: SortOrder;
}

export interface ReviewInput {
  bookId: string;
  rating: number;
  comment: string;
}

export interface Review {
  _id: string;
  bookId: string;
  userId: string;
  rating: number;
  comment: string;
}

export interface QueryResolvers {
  books: (parent: unknown, args: { 
    filter?: BookFilterInput;
    limit?: number;
    offset?: number;
  }) => Promise<PaginatedBooks>;
  book: (parent: unknown, args: { id: number }) => Promise<Book | null>;
  myBooks: (parent: unknown, args: { 
    limit?: number;
    offset?: number;
    sort?: SortInput;
  }, context: { user: User }) => Promise<PaginatedBooks>;
  user: (parent: unknown, args: unknown, context: { user: User }) => Promise<User | null>;
  bookReviews: (parent: unknown, args: { bookId: number, limit: number, offset: number }) => Promise<{
    reviews: Review[];
    total: number;
    hasMore: boolean;
  }>;
}

export interface MutationResolvers {
  createBook: (parent: unknown, args: { bookInput: BookInput }, context: { user?: User }) => Promise<Book | null>;
  updateBook: (parent: unknown, args: { id: string, bookInput: BookInput }, context: { user: User }) => Promise<Book>;
  deleteBook: (parent: unknown, args: { id: string }, context: { user: User }) => Promise<DeleteResponse>;
  signup: (parent: unknown, args: { userInput: UserInput }) => Promise<AuthResponse>;
  login: (parent: unknown, args: { loginUserInput: LoginUserInput }) => Promise<AuthResponse>;
  createReview: (parent: unknown, args: { reviewInput: ReviewInput }, context: { user: User }) => Promise<Review | null>;
}

export interface Resolvers {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
} 