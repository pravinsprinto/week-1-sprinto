import { withAuth } from '../components/withAuth';
import { useCreateBookMutation } from '../graphql/generated';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from '@radix-ui/themes';
import 'react-quill/dist/quill.snow.css';
import 'react-quill-new/dist/quill.snow.css';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

function AddBook() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    publishedDate: new Date().toISOString().split('T')[0]
  });
  const [errorMessage, setErrorMessage] = useState('');

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'header': [1, 2, false] }],
      [{ 'list': 'ordered' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link']
    ]
  };

  const [createBook, { loading }] = useCreateBookMutation({
    onCompleted: () => {
      router.push('/');
    },
    onError: (error) => {
      setErrorMessage(error.message);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBook({
        variables: {
          bookInput: {
            ...formData,
            publishedDate: new Date(formData.publishedDate).toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Add book error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Add New Book</h1>
      {errorMessage && (
        <div className="mb-4 text-red-500">{errorMessage}</div>
      )}
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

        <div className="mb-20">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <ReactQuill className='h-48'  modules={modules} value={formData.description} onChange={(value) => setFormData({ ...formData, description: value })} />
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

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${loading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'} 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {loading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding Book...
            </div>
          ) : (
            'Add Book'
          )}
        </button>
      </form>
    </div>
  );
}

export default withAuth(AddBook); 