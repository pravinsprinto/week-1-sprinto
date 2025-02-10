import { useState } from 'react';
import { useSignupMutation } from '../graphql/generated';
import { useRouter } from 'next/router';

export function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    biography: '',
    bornDate: '',
    profilePicture: 'https://avatar.iran.liara.run/public/',
    isAuthor: false
  });

  const [signup, { loading, error }] = useSignupMutation({
    onCompleted: (data) => {
      localStorage.setItem('token', data.signup.token);
      router.push('/');
    }
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup({
      variables: {
        userInput: formData
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Existing fields */}
      {/* <div>
        <label className="block text-sm font-medium text-gray-700">
          Profile Picture URL
        </label>
        <input
          type="url"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.profilePicture}
          onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
        />
      </div> */}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Register as Author?
        </label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.isAuthor.toString()}
          onChange={(e) => setFormData({ ...formData, isAuthor: e.target.value === 'true' })}
        >
          <option value="false">No, I just want to read and review books</option>
          <option value="true">Yes, I want to publish books</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
} 