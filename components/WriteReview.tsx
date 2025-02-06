import { useState } from 'react';
import { Card, Flex, Text, Button, TextArea } from '@radix-ui/themes';
import * as Toast from '@radix-ui/react-toast';
import { StarFilledIcon, StarIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useAuth } from '../contexts/AuthContext';
import { useCreateReviewMutation } from '../graphql/generated';
import { withAuth } from './withAuth';
interface WriteReviewProps {
  bookId: number;
  onReviewSubmitted?: () => void;
  onClose?: () => void;
  onError?: (error: string) => void;
}

function WriteReview({ bookId, onReviewSubmitted, onClose, onError }: WriteReviewProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [error, setError] = useState('');

  const [createReview, { loading }] = useCreateReviewMutation({
    onCompleted: () => {
      setRating(0);
      setComment('');
      onReviewSubmitted?.();
    },
    onError: (error) => {
      onError?.(error.message);
    }
  });

  if (!user) {
    return (
      <Card className="p-4">
        <Text>Please log in to write a review.</Text>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      await createReview({
        variables: {
          reviewInput: {
            bookId,
            rating,
            comment
          }
        }
      });
    } catch (error) {
      // Error handled by onError callback
    }
  };

  return (
    <>
      <Card size="3" className="w-full bg-white shadow-lg border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Flex justify="between" align="center">
           
            <Text size="5" weight="bold" className="text-gray-800 flex-grow text-center">
              Write Your Review
            </Text>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <Cross2Icon className="w-4 h-4 " />
            </Button>

            
          </Flex>

          <div className="space-y-2">
            <Text as="label" size="2" weight="medium" className="text-gray-700">Your Rating</Text>
            <div className="flex gap-2 justify-center my-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  type="button"
                  variant="ghost"
                  className="p-1 hover:scale-110 transition-transform"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  {star <= (hoveredRating || rating) ? (
                    <StarFilledIcon className="w-8 h-8 text-yellow-400" />
                  ) : (
                    <StarIcon className="w-8 h-8 text-gray-300 hover:text-yellow-200" />
                  )}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3 mt-6">
            <Text as="label" size="2" weight="medium" className="text-gray-700">Your Thoughts</Text>
            <TextArea
              placeholder="Share your thoughts about this book..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              size="3"
              className="min-h-[150px] w-full p-3 rounded-md border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <Flex gap="3" justify="end" className="mt-6">
            <Button
              variant="soft"
              onClick={onClose}
              color="gray"
              className="px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="solid"
              color="blue"
              disabled={loading || !rating || !comment.trim()}
              className="px-4"
            >
              {loading ? (
                <Flex gap="2" align="center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </Flex>
              ) : (
                'Submit Review'
              )}
            </Button>
          </Flex>
        </form>
      </Card>
    </>
  );
} 
export default withAuth(WriteReview);   