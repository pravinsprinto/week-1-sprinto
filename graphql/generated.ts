import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  token: Scalars['String']['output'];
  user: User;
};

export type Book = {
  __typename?: 'Book';
  author: User;
  averageRating?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  image: Scalars['String']['output'];
  publishedDate: Scalars['String']['output'];
  title: Scalars['String']['output'];
  totalReviews: Scalars['Int']['output'];
};

export type BookFilterInput = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  filterBy?: InputMaybe<Scalars['String']['input']>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};

export type BookInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  image: Scalars['String']['input'];
  publishedDate: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type DeleteResponse = {
  __typename?: 'DeleteResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBook: Book;
  createReview: Review;
  deleteBook: DeleteResponse;
  login: AuthResponse;
  signup: AuthResponse;
  updateBook: Book;
};


export type MutationCreateBookArgs = {
  bookInput: BookInput;
};


export type MutationCreateReviewArgs = {
  reviewInput: ReviewInput;
};


export type MutationDeleteBookArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  loginUserInput: LoginUserInput;
};


export type MutationSignupArgs = {
  userInput: UserInput;
};


export type MutationUpdateBookArgs = {
  bookInput: BookInput;
  id: Scalars['ID']['input'];
};

export type PaginatedBooks = {
  __typename?: 'PaginatedBooks';
  books: Array<Maybe<Book>>;
  total: Scalars['Int']['output'];
};

export type PaginatedReviews = {
  __typename?: 'PaginatedReviews';
  hasMore: Scalars['Boolean']['output'];
  reviews: Array<Maybe<Review>>;
  total: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  book?: Maybe<Book>;
  bookReviews: PaginatedReviews;
  books: PaginatedBooks;
  myBooks: PaginatedBooks;
  user?: Maybe<User>;
};


export type QueryBookArgs = {
  id: Scalars['Int']['input'];
};


export type QueryBookReviewsArgs = {
  bookId: Scalars['Int']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};


export type QueryBooksArgs = {
  filter?: InputMaybe<BookFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMyBooksArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortInput>;
};

export type Review = {
  __typename?: 'Review';
  _id: Scalars['String']['output'];
  book: Book;
  comment: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  rating: Scalars['Int']['output'];
  user: User;
};

export type ReviewInput = {
  bookId: Scalars['Int']['input'];
  comment: Scalars['String']['input'];
  rating: Scalars['Int']['input'];
};

export type SortInput = {
  field: Scalars['String']['input'];
  order: SortOrder;
};

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type User = {
  __typename?: 'User';
  biography?: Maybe<Scalars['String']['output']>;
  books?: Maybe<Array<Maybe<Book>>>;
  bornDate: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isAuthor: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  password: Scalars['String']['output'];
  profilePicture?: Maybe<Scalars['String']['output']>;
  salt: Scalars['String']['output'];
};

export type UserInput = {
  biography?: InputMaybe<Scalars['String']['input']>;
  bornDate: Scalars['String']['input'];
  email: Scalars['String']['input'];
  isAuthor: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  profilePicture?: InputMaybe<Scalars['String']['input']>;
};

export type LoginUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type GetBooksQueryVariables = Exact<{
  filter?: InputMaybe<BookFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetBooksQuery = { __typename?: 'Query', books: { __typename?: 'PaginatedBooks', total: number, books: Array<{ __typename?: 'Book', id: number, title: string, description?: string | null, image: string, publishedDate: string, averageRating?: number | null, totalReviews: number, author: { __typename?: 'User', name: string } } | null> } };

export type LoginMutationVariables = Exact<{
  loginUserInput: LoginUserInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthResponse', token: string, user: { __typename?: 'User', id: number, name: string, email: string, isAuthor: boolean } } };

export type SignupMutationVariables = Exact<{
  userInput: UserInput;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'AuthResponse', token: string, user: { __typename?: 'User', id: number, name: string, email: string, isAuthor: boolean } } };

export type CreateBookMutationVariables = Exact<{
  bookInput: BookInput;
}>;


export type CreateBookMutation = { __typename?: 'Mutation', createBook: { __typename?: 'Book', id: number, title: string, description?: string | null, image: string, publishedDate: string, totalReviews: number, author: { __typename?: 'User', name: string } } };

export type UpdateBookMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  bookInput: BookInput;
}>;


export type UpdateBookMutation = { __typename?: 'Mutation', updateBook: { __typename?: 'Book', id: number, title: string, description?: string | null, image: string, publishedDate: string, totalReviews: number, author: { __typename?: 'User', name: string } } };

export type DeleteBookMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteBookMutation = { __typename?: 'Mutation', deleteBook: { __typename?: 'DeleteResponse', success: boolean, message: string } };

export type GetMyBooksQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortInput>;
}>;


export type GetMyBooksQuery = { __typename?: 'Query', myBooks: { __typename?: 'PaginatedBooks', total: number, books: Array<{ __typename?: 'Book', id: number, title: string, description?: string | null, image: string, publishedDate: string, averageRating?: number | null, totalReviews: number, author: { __typename?: 'User', name: string } } | null> } };

export type GetBookDetailsQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetBookDetailsQuery = { __typename?: 'Query', book?: { __typename?: 'Book', id: number, title: string, description?: string | null, image: string, publishedDate: string, averageRating?: number | null, totalReviews: number, author: { __typename?: 'User', id: number, name: string } } | null };

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: number, name: string, email: string, isAuthor: boolean, profilePicture?: string | null } | null };

export type CreateReviewMutationVariables = Exact<{
  reviewInput: ReviewInput;
}>;


export type CreateReviewMutation = { __typename?: 'Mutation', createReview: { __typename?: 'Review', _id: string, rating: number, comment: string } };

export type GetBookReviewsQueryVariables = Exact<{
  bookId: Scalars['Int']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type GetBookReviewsQuery = { __typename?: 'Query', bookReviews: { __typename?: 'PaginatedReviews', total: number, hasMore: boolean, reviews: Array<{ __typename?: 'Review', _id: string, rating: number, comment: string, createdAt: string, user: { __typename?: 'User', id: number, name: string, profilePicture?: string | null } } | null> } };


export const GetBooksDocument = gql`
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

/**
 * __useGetBooksQuery__
 *
 * To run a query within a React component, call `useGetBooksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBooksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBooksQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetBooksQuery(baseOptions?: Apollo.QueryHookOptions<GetBooksQuery, GetBooksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBooksQuery, GetBooksQueryVariables>(GetBooksDocument, options);
      }
export function useGetBooksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBooksQuery, GetBooksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBooksQuery, GetBooksQueryVariables>(GetBooksDocument, options);
        }
export function useGetBooksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBooksQuery, GetBooksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBooksQuery, GetBooksQueryVariables>(GetBooksDocument, options);
        }
export type GetBooksQueryHookResult = ReturnType<typeof useGetBooksQuery>;
export type GetBooksLazyQueryHookResult = ReturnType<typeof useGetBooksLazyQuery>;
export type GetBooksSuspenseQueryHookResult = ReturnType<typeof useGetBooksSuspenseQuery>;
export type GetBooksQueryResult = Apollo.QueryResult<GetBooksQuery, GetBooksQueryVariables>;
export const LoginDocument = gql`
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
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      loginUserInput: // value for 'loginUserInput'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const SignupDocument = gql`
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
export type SignupMutationFn = Apollo.MutationFunction<SignupMutation, SignupMutationVariables>;

/**
 * __useSignupMutation__
 *
 * To run a mutation, you first call `useSignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signupMutation, { data, loading, error }] = useSignupMutation({
 *   variables: {
 *      userInput: // value for 'userInput'
 *   },
 * });
 */
export function useSignupMutation(baseOptions?: Apollo.MutationHookOptions<SignupMutation, SignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignupMutation, SignupMutationVariables>(SignupDocument, options);
      }
export type SignupMutationHookResult = ReturnType<typeof useSignupMutation>;
export type SignupMutationResult = Apollo.MutationResult<SignupMutation>;
export type SignupMutationOptions = Apollo.BaseMutationOptions<SignupMutation, SignupMutationVariables>;
export const CreateBookDocument = gql`
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
export type CreateBookMutationFn = Apollo.MutationFunction<CreateBookMutation, CreateBookMutationVariables>;

/**
 * __useCreateBookMutation__
 *
 * To run a mutation, you first call `useCreateBookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBookMutation, { data, loading, error }] = useCreateBookMutation({
 *   variables: {
 *      bookInput: // value for 'bookInput'
 *   },
 * });
 */
export function useCreateBookMutation(baseOptions?: Apollo.MutationHookOptions<CreateBookMutation, CreateBookMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBookMutation, CreateBookMutationVariables>(CreateBookDocument, options);
      }
export type CreateBookMutationHookResult = ReturnType<typeof useCreateBookMutation>;
export type CreateBookMutationResult = Apollo.MutationResult<CreateBookMutation>;
export type CreateBookMutationOptions = Apollo.BaseMutationOptions<CreateBookMutation, CreateBookMutationVariables>;
export const UpdateBookDocument = gql`
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
export type UpdateBookMutationFn = Apollo.MutationFunction<UpdateBookMutation, UpdateBookMutationVariables>;

/**
 * __useUpdateBookMutation__
 *
 * To run a mutation, you first call `useUpdateBookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBookMutation, { data, loading, error }] = useUpdateBookMutation({
 *   variables: {
 *      id: // value for 'id'
 *      bookInput: // value for 'bookInput'
 *   },
 * });
 */
export function useUpdateBookMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBookMutation, UpdateBookMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBookMutation, UpdateBookMutationVariables>(UpdateBookDocument, options);
      }
export type UpdateBookMutationHookResult = ReturnType<typeof useUpdateBookMutation>;
export type UpdateBookMutationResult = Apollo.MutationResult<UpdateBookMutation>;
export type UpdateBookMutationOptions = Apollo.BaseMutationOptions<UpdateBookMutation, UpdateBookMutationVariables>;
export const DeleteBookDocument = gql`
    mutation DeleteBook($id: ID!) {
  deleteBook(id: $id) {
    success
    message
  }
}
    `;
export type DeleteBookMutationFn = Apollo.MutationFunction<DeleteBookMutation, DeleteBookMutationVariables>;

/**
 * __useDeleteBookMutation__
 *
 * To run a mutation, you first call `useDeleteBookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBookMutation, { data, loading, error }] = useDeleteBookMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteBookMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBookMutation, DeleteBookMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBookMutation, DeleteBookMutationVariables>(DeleteBookDocument, options);
      }
export type DeleteBookMutationHookResult = ReturnType<typeof useDeleteBookMutation>;
export type DeleteBookMutationResult = Apollo.MutationResult<DeleteBookMutation>;
export type DeleteBookMutationOptions = Apollo.BaseMutationOptions<DeleteBookMutation, DeleteBookMutationVariables>;
export const GetMyBooksDocument = gql`
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

/**
 * __useGetMyBooksQuery__
 *
 * To run a query within a React component, call `useGetMyBooksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyBooksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyBooksQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useGetMyBooksQuery(baseOptions?: Apollo.QueryHookOptions<GetMyBooksQuery, GetMyBooksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyBooksQuery, GetMyBooksQueryVariables>(GetMyBooksDocument, options);
      }
export function useGetMyBooksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyBooksQuery, GetMyBooksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyBooksQuery, GetMyBooksQueryVariables>(GetMyBooksDocument, options);
        }
export function useGetMyBooksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyBooksQuery, GetMyBooksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyBooksQuery, GetMyBooksQueryVariables>(GetMyBooksDocument, options);
        }
export type GetMyBooksQueryHookResult = ReturnType<typeof useGetMyBooksQuery>;
export type GetMyBooksLazyQueryHookResult = ReturnType<typeof useGetMyBooksLazyQuery>;
export type GetMyBooksSuspenseQueryHookResult = ReturnType<typeof useGetMyBooksSuspenseQuery>;
export type GetMyBooksQueryResult = Apollo.QueryResult<GetMyBooksQuery, GetMyBooksQueryVariables>;
export const GetBookDetailsDocument = gql`
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

/**
 * __useGetBookDetailsQuery__
 *
 * To run a query within a React component, call `useGetBookDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBookDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBookDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetBookDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetBookDetailsQuery, GetBookDetailsQueryVariables> & ({ variables: GetBookDetailsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBookDetailsQuery, GetBookDetailsQueryVariables>(GetBookDetailsDocument, options);
      }
export function useGetBookDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBookDetailsQuery, GetBookDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBookDetailsQuery, GetBookDetailsQueryVariables>(GetBookDetailsDocument, options);
        }
export function useGetBookDetailsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBookDetailsQuery, GetBookDetailsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBookDetailsQuery, GetBookDetailsQueryVariables>(GetBookDetailsDocument, options);
        }
export type GetBookDetailsQueryHookResult = ReturnType<typeof useGetBookDetailsQuery>;
export type GetBookDetailsLazyQueryHookResult = ReturnType<typeof useGetBookDetailsLazyQuery>;
export type GetBookDetailsSuspenseQueryHookResult = ReturnType<typeof useGetBookDetailsSuspenseQuery>;
export type GetBookDetailsQueryResult = Apollo.QueryResult<GetBookDetailsQuery, GetBookDetailsQueryVariables>;
export const GetUserDocument = gql`
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

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserQuery(baseOptions?: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export function useGetUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserSuspenseQueryHookResult = ReturnType<typeof useGetUserSuspenseQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const CreateReviewDocument = gql`
    mutation CreateReview($reviewInput: ReviewInput!) {
  createReview(reviewInput: $reviewInput) {
    _id
    rating
    comment
  }
}
    `;
export type CreateReviewMutationFn = Apollo.MutationFunction<CreateReviewMutation, CreateReviewMutationVariables>;

/**
 * __useCreateReviewMutation__
 *
 * To run a mutation, you first call `useCreateReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReviewMutation, { data, loading, error }] = useCreateReviewMutation({
 *   variables: {
 *      reviewInput: // value for 'reviewInput'
 *   },
 * });
 */
export function useCreateReviewMutation(baseOptions?: Apollo.MutationHookOptions<CreateReviewMutation, CreateReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateReviewMutation, CreateReviewMutationVariables>(CreateReviewDocument, options);
      }
export type CreateReviewMutationHookResult = ReturnType<typeof useCreateReviewMutation>;
export type CreateReviewMutationResult = Apollo.MutationResult<CreateReviewMutation>;
export type CreateReviewMutationOptions = Apollo.BaseMutationOptions<CreateReviewMutation, CreateReviewMutationVariables>;
export const GetBookReviewsDocument = gql`
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

/**
 * __useGetBookReviewsQuery__
 *
 * To run a query within a React component, call `useGetBookReviewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBookReviewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBookReviewsQuery({
 *   variables: {
 *      bookId: // value for 'bookId'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetBookReviewsQuery(baseOptions: Apollo.QueryHookOptions<GetBookReviewsQuery, GetBookReviewsQueryVariables> & ({ variables: GetBookReviewsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBookReviewsQuery, GetBookReviewsQueryVariables>(GetBookReviewsDocument, options);
      }
export function useGetBookReviewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBookReviewsQuery, GetBookReviewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBookReviewsQuery, GetBookReviewsQueryVariables>(GetBookReviewsDocument, options);
        }
export function useGetBookReviewsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBookReviewsQuery, GetBookReviewsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBookReviewsQuery, GetBookReviewsQueryVariables>(GetBookReviewsDocument, options);
        }
export type GetBookReviewsQueryHookResult = ReturnType<typeof useGetBookReviewsQuery>;
export type GetBookReviewsLazyQueryHookResult = ReturnType<typeof useGetBookReviewsLazyQuery>;
export type GetBookReviewsSuspenseQueryHookResult = ReturnType<typeof useGetBookReviewsSuspenseQuery>;
export type GetBookReviewsQueryResult = Apollo.QueryResult<GetBookReviewsQuery, GetBookReviewsQueryVariables>;