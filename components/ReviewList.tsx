import { StarFilledIcon, StarIcon } from '@radix-ui/react-icons';
import { Card, Flex, Text, Avatar, Button } from '@radix-ui/themes';
import { useGetBookReviewsQuery } from '../graphql/generated';
import { useEffect, useState } from 'react';

interface ReviewListProps {
    bookId: number;
}

const REVIEWS_PER_PAGE = 5;

export default function ReviewList({ bookId }: ReviewListProps) {
    const [offset, setOffset] = useState(0);

    const { data, loading, error, fetchMore, refetch } = useGetBookReviewsQuery({
        variables: {
            bookId,
            limit: REVIEWS_PER_PAGE,
            offset: 0
        }
    });
    useEffect(() => {
        refetch();
    }, [bookId]);

    const loadMore = () => {
        const newOffset = offset + REVIEWS_PER_PAGE;
        fetchMore({
            variables: {
                offset: newOffset,
                limit: REVIEWS_PER_PAGE,
                bookId
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return {
                    bookReviews: {
                        ...fetchMoreResult.bookReviews,
                        reviews: [
                            ...prev.bookReviews.reviews,
                            ...fetchMoreResult.bookReviews.reviews
                        ]
                    }
                };
            }
        });
        setOffset(newOffset);
    };

    if (loading && !data) return (
        <Card className="p-4 text-center">
            <Text color="gray">Loading reviews...</Text>
        </Card>
    );

    if (error) return (
        <Card className="p-4 text-center">
            <Text color="red">Error loading reviews: {error.message}</Text>
        </Card>
    );

    if (!data?.bookReviews?.reviews?.length) {
        return (
            <Card className="p-4 text-center">
                <Text color="gray">No reviews yet. Be the first to review!</Text>
            </Card>
        );
    }

    return (
        <>
            <h2 className="text-2xl font-bold mb-6">Reviews ({data?.bookReviews?.total || 0})</h2>
            <div className="space-y-6">
                {data.bookReviews.reviews.map((review: any) => (
                    <Card key={review._id} className="p-4">
                        <Flex direction="column" gap="3">
                            <Flex justify="between" align="center">
                                <Flex align="center" gap="2">
                                    <Avatar
                                        src={review.user.profilePicture}
                                        fallback={review.user.name[0]}
                                        size="2"
                                    />
                                    <Text weight="medium">{review.user.name}</Text>
                                </Flex>
                                <Text size="1" color="gray">
                                    {new Date(Number(review.createdAt)).toLocaleDateString()}
                                </Text>
                            </Flex>

                            <Flex gap="1">
                                {
                                    [...Array(review.rating)].map((_, i) => (
                                        <StarFilledIcon
                                            key={i}
                                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                {
                                    [...Array(5 - review.rating)].map((_, i) => (
                                        <StarIcon
                                            key={i}
                                            className="w-4 h-4 text-gray-300"
                                        />
                                    ))}
                            </Flex>

                            <Text>{review.comment}</Text>
                        </Flex>
                    </Card>
                ))}

                {data.bookReviews.hasMore && (
                    <div className="text-center mt-6">
                        <Button
                            variant="soft"
                            onClick={loadMore}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Load More Reviews'}
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
} 