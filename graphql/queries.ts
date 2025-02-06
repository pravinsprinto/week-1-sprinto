import { gql } from '@apollo/client';

export const GET_BOOKS = gql`
  query GetBooks($filter: BookFilterInput, $limit: Int, $offset: Int) {
    books(filter: $filter, limit: $limit, offset: $offset) {
      books {
        id
        title
        description
        image
        publishedDate
        averageRating
        totalReviews
        author {
          name
        }
      }
      total
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($loginUserInput: loginUserInput!) {
    login(loginUserInput: $loginUserInput) {
      token
      user {
        id
        name
        email
        isAuthor
      }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($userInput: UserInput!) {
    signup(userInput: $userInput) {
      token
      user {
        id
        name
        email
        isAuthor
      }
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation CreateBook($bookInput: BookInput!) {
    createBook(bookInput: $bookInput) {
      id
      title
      description
      image
      publishedDate
      totalReviews
      author {
        name
      }
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $bookInput: BookInput!) {
    updateBook(id: $id, bookInput: $bookInput) {
      id
      title
      description
      image
      publishedDate
      totalReviews
      author {
        name
      }
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id) {
      success
      message
    }
  }
`;

export const GET_MY_BOOKS = gql`
  query GetMyBooks($limit: Int, $offset: Int, $sort: SortInput) {
    myBooks(limit: $limit, offset: $offset, sort: $sort) {
      books {
        id
        title
        description
        image
        publishedDate
        averageRating
        totalReviews
        author {
          name
        }
      }
      total
    }
  }
`;

export const GET_BOOK_DETAILS = gql`
  query GetBookDetails($id: Int!) {
    book(id: $id) {
      id
      title
      description
      image
      publishedDate
      averageRating 
      totalReviews
      author {
        id
        name
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser {
    user {
      id
      name
      email
      isAuthor
      profilePicture
    }
  }
`;

export const CREATE_REVIEW = gql`
  mutation CreateReview($reviewInput: ReviewInput!) {
    createReview(reviewInput: $reviewInput) {
      _id
      rating
      comment
    }
  }
`;

export const GET_BOOK_REVIEWS = gql`
  query GetBookReviews($bookId: Int!, $limit: Int!, $offset: Int!) {
    bookReviews(bookId: $bookId, limit: $limit, offset: $offset) {
      reviews {
        _id
        rating
        comment
        createdAt
        user {
          id
          name
          profilePicture
        }
      }
      total
      hasMore
    }
  }
`; 