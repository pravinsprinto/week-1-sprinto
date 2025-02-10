import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSignupMutation } from '../graphql/generated';
import { useAuth } from '../contexts/AuthContext';
import * as Toast from '@radix-ui/react-toast';

export default function Signup() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    biography: '',
    bornDate: '',
    profilePicture: 'https://avatar.iran.liara.run/public/',
    isAuthor: false
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    bornDate: '',
  });
  const [open, setOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [signupMutation, { loading, data }] = useSignupMutation({
    onCompleted: (data) => {
      authLogin(data.signup.token, data.signup.user as any);
      setToastMessage('Signup successful!');
      setOpen(true);
      setTimeout(() => {
        if (data.signup.user.isAuthor) {
          router.push('/my-books');
        } else {
          router.push('/');
        }
      }, 2000);
    },
    onError: (error) => {
      setErrorMessage(error.message);
    }
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
      bornDate: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!formData.bornDate) {
      newErrors.bornDate = 'Birth date is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await signupMutation({
          variables: {
            userInput: {
              ...formData,
              bornDate: new Date(formData.bornDate).toISOString()
            }
          }
        });
      } catch (error) {
        console.error('Signup error:', error);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      {errorMessage && (
        <div className="mb-4 text-red-500">{errorMessage}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Biography</label>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.biography}
            onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Birth Date</label>
          <input
            type="date"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.bornDate}
            onChange={(e) => setFormData({ ...formData, bornDate: e.target.value })}
          />
          {errors.bornDate && <span className="text-red-500 text-sm">{errors.bornDate}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
          <input
            type="url"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.profilePicture}
            onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Register as Author?</label>
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
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      {/* Login link */}

      <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
        <Toast.Title className="ToastTitle">{toastMessage}</Toast.Title>
        <Toast.Action className="ToastAction" asChild altText="Close">
          <button className="Button small green">Close</button>
        </Toast.Action>
      </Toast.Root>
      <Toast.Viewport className="ToastViewport" />
    </div>
  );
} 