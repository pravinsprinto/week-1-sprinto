import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useGetUserQuery, User } from '../graphql/generated';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const { data, loading } = useGetUserQuery();
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    if (user) {
      setIsAuthor(user.isAuthor || false);
    }
  }, [user]);

  const navLinks = [
    { href: '/', label: 'Home' },
    // { href: '/books', label: 'Books' },
    // { href: '/authors', label: 'Authors' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-2 py-2 text-gray-700 hover:text-gray-900 ${pathname === link.href ? 'text-blue-600 font-medium border-b-2 border-blue-600' : ''
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {isAuthor && (
                    <>
                      <Link
                        href="/add-book"
                      className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium ${pathname === '/add-book' ? 'text-blue-600 border-b-2 border-blue-600' : ''
                        }`}
                    >
                      Add Book
                    </Link>
                    <Link
                      href="/my-books"
                      className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium ${pathname === '/my-books' ? 'text-blue-600 border-b-2 border-blue-600' : ''
                        }`}
                    >
                      My Books
                    </Link>
                  </>
                  )}
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                        <span>{user.name || 'User'}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content className="bg-white rounded-md shadow-lg p-1 min-w-[160px]" sideOffset={5}>
                        <DropdownMenu.Item className="outline-none">
                          <button
                            onClick={() => {
                              logout();
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                          >
                            Logout
                          </button>
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
} 