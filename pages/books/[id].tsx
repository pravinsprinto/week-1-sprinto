// View a single book

import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { StarIcon, Cross2Icon } from '@radix-ui/react-icons';
import * as Toast from '@radix-ui/react-toast';
import DOMPurify from 'dompurify';
import { useGetBookDetailsQuery, useGetUserQuery } from '../../graphql/generated';
import Link from 'next/link';
import WriteReview from '../../components/WriteReview';
import ReviewList from '../../components/ReviewList';
import { Card, Text, Flex } from '@radix-ui/themes';
import { useAuth } from 'contexts/AuthContext';

function BookDetails() {
    const router = useRouter();
    const reviewFormRef = useRef<HTMLDivElement>(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [open, setOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const { id } = router.query;
    const { data: userData , refetch: refetchUser } = useGetUserQuery();
    const { user, logout } = useAuth();
    useEffect(() => {
        if (showReviewForm) {
            reviewFormRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showReviewForm]);

    useEffect(() => {
        refetchUser();
    }, [user]);

    const { loading, error, data, refetch } = useGetBookDetailsQuery({
        variables: { id: parseInt(id as string) },
        skip: !id
    });

    if (loading) return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="aspect-[3/4] animate-pulse bg-gray-200" />
                <div className="space-y-4">
                    <div className="h-8 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-32 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>
        </div>
    );
    if (error) return <div>Error: {error.message}</div>;
    if (!data?.book) return <div>Book not found</div>;

    const { book } = data;
    const sanitizedDescription = DOMPurify.sanitize(book.description || '');
    // console.log(sanitizedDescription);
    const canReview = userData?.user?.id !== book.author.id;
      console.log(userData);

    const handleReviewError = (error: string) => {
        setToastMessage(error);
        setOpen(true);
        setShowReviewForm(false);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
                    <img
                        src={book.image}
                        alt={book.title}
                        className="object-cover w-full h-full"
                    />
                </div>

                <div>
                    <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                    <p className="text-gray-600 mb-4">by {book.author.name}</p>

                    <div className="flex items-center mb-4">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon
                                    key={i}
                                    className={`w-5 h-5 ${i < Number(book.averageRating || 0)
                                            ? 'text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="ml-2 text-gray-600">
                            ({Number(book.averageRating || 0).toFixed(1)} Rating)
                        </span>
                    </div>

                    <div 
                        className="prose text-gray-700 mb-6"
                        dangerouslySetInnerHTML={{ __html: sanitizedDescription }} 
                    />

                    {userData ? (
                        canReview ? (
                            <button
                                onClick={() => setShowReviewForm(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Write a Review
                            </button>
                        ) : (
                            <Card className="p-4 text-center">
                                <Text color="gray">You cannot review your own book.</Text>
                            </Card>
                        )
                    ) : (
                        <div className="mt-4 text-center">
                            <p className="text-gray-600">Please
                                <Link href="/login">
                                    <span className="text-blue-600"> login </span>
                                </Link>
                                or
                                <Link href="/signup">
                                    <span className="text-blue-600"> sign up </span>
                                </Link>
                                to write a review
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {showReviewForm && (
                <div className="mt-8 mb-12" ref={reviewFormRef}>
                    <WriteReview
                        bookId={parseInt(id as string)}
                        onClose={() => setShowReviewForm(false)}
                        onReviewSubmitted={() => {
                            refetch();
                            setShowReviewForm(false);
                        }}
                        onError={handleReviewError}
                    />
                </div>
            )}

            {!showReviewForm && <div className="mt-8">
                <ReviewList key={book.id} bookId={parseInt(id as string)} />
            </div>}

            <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
                <div className="ToastContent">
                    <Toast.Title className="ToastTitle">Error</Toast.Title>
                    <Toast.Description className="ToastDescription">{toastMessage}</Toast.Description>
                </div>
                <Toast.Close className="ToastClose">
                    <Cross2Icon className="w-4 h-4" />
                </Toast.Close>
            </Toast.Root>
        </div>
    );
}

export default BookDetails;
