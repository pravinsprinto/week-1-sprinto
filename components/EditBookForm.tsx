import React, { useState } from 'react';
import { useUpdateBookMutation } from '../graphql/generated';

interface EditBookFormProps {
  book: any;
  onCancel: () => void;
  onCompleted?: () => void;
}

export function EditBookForm({ book, onCancel, onCompleted }: EditBookFormProps) {
  const [formData, setFormData] = useState({
    title: book.title || '',
    description: book.description || '',
    image: book.image || '',
    publishedDate: book.publishedDate ? new Date(Number(book.publishedDate)).toISOString().split('T')[0] : '',
  });

  const [updateBook, { loading, error }] = useUpdateBookMutation({
    onCompleted: (data) => {
      if (data.updateBook) {
        onCompleted && onCompleted();
        onCancel();
      }
    },
    onError: (err) => {
      alert('Update error: ' + err.message);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateBook({
        variables: {
          id: book.id,
          bookInput: {
            ...formData,
            publishedDate: formData.publishedDate 
              ? new Date(formData.publishedDate).toISOString()
              : new Date().toISOString()
          },
        },
      });
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Book</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="url"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Publication Date</label>
            <input
              type="date"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.publishedDate}
              onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm">
              Error: {error.message}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button 
              type="button" 
              onClick={onCancel} 
              className="px-4 py-2 bg-gray-300 rounded-md"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md" 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 