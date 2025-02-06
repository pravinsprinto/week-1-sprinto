import { withAuth } from '../components/withAuth';
import { SortOrder, useGetMyBooksQuery } from '../graphql/generated';
import { NetworkStatus } from '@apollo/client';
import Link from 'next/link';
import { useState } from 'react';
import { EditBookForm } from '../components/EditBookForm';
import { DeleteBookButton } from '../components/DeleteBookButton';
import { useRouter } from 'next/router';

function MyBooks() {
  const [sortConfig, setSortConfig] = useState<{ field: string; order: 'ASC' | 'DESC' }>({
    field: 'publishedDate',
    order: 'DESC'
  });

  const { loading, error, data, refetch, networkStatus } = useGetMyBooksQuery({
    variables: {
      limit: 10,
      offset: 0,
      sort: {
        field: sortConfig.field,
        order: sortConfig.order as SortOrder
      }
    },
    notifyOnNetworkStatusChange: true
  });

  const router = useRouter();

  // State for handling the edit modal
  const [editingBook, setEditingBook] = useState<any>(null);

  if (loading && networkStatus !== NetworkStatus.refetch) return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center">
      Error loading books: {error.message}
    </div>
  );

  if (!data?.myBooks?.books?.length) {
    return (
      <div className="text-center py-16">
        <div className="mb-6">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-700">No books published yet</h2>
        <p className="text-gray-500 mt-2 mb-6">Get started by creating your first book</p>
        <Link 
          href="/add-book"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg 
            className="-ml-1 mr-2 h-5 w-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Your First Book
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
          <p className="mt-1 text-sm text-gray-500">
            You have published {data.myBooks.total} book{data.myBooks.total !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            className="rounded-md border-gray-300"
            value={`${sortConfig.field}-${sortConfig.order}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortConfig({ field, order: order as 'ASC' | 'DESC' });
            }}
          >
            <option value="publishedDate-DESC">Newest First</option>
            <option value="publishedDate-ASC">Oldest First</option>
            <option value="title-ASC">Title A-Z</option>
            <option value="title-DESC">Title Z-A</option>
          </select>
          <Link
            href="/add-book"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Add New Book
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.myBooks.books.map((book: any) => (
          <div key={book.id} className="group bg-white rounded-lg p-4 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col gap-3">
            <div 
              className="aspect-[3/4] relative overflow-hidden rounded-md cursor-pointer"
              onClick={() => router.push(`/books/${book.id}`)}
            >
              <img 
                src={book.image || 'https://via.placeholder.com/150'} 
                alt={book.title}
                className="object-cover w-full h-full transform transition-transform duration-200 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold line-clamp-1">
                {book.title}
              </h3>
              <p className="text-sm text-gray-500">
                by {book.author.name}
              </p>
            </div>

            <p className="line-clamp-2 text-gray-600 text-sm leading-relaxed">
              {book.description}
            </p>

            <div className="flex gap-2 mt-auto pt-2">
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {new Date(Number(book.publishedDate)).getFullYear()}
              </span>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Published
              </span>
            </div>
            
            <div className="pt-3 mt-auto border-t border-gray-100">
              <div className="flex gap-2 justify-end">
                <button
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setEditingBook(book)}
                >
                  Edit
                </button>
                <DeleteBookButton id={book.id} onDeleted={refetch} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {data.myBooks.total === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No books published yet. Start by adding your first book!</p>
        </div>
      )}

      {editingBook && (
        <EditBookForm 
          book={editingBook} 
          onCancel={() => setEditingBook(null)} 
          onCompleted={refetch}
        />
      )}
    </div>
  );
}

export default withAuth(MyBooks); 