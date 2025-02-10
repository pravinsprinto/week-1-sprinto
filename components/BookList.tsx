import { Card, Flex, Text, Badge, Container, Heading, Link as LinkTheme } from '@radix-ui/themes';
import { useGetBooksQuery } from '../graphql/generated';
import { SearchBar, SearchFilters } from './SearchBar';
import { StarIcon } from '@radix-ui/react-icons';
import { Book as BookIcon, AlertCircle } from 'lucide-react';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import DOMPurify from 'dompurify';

export default function BookList() {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    filterBy: 'title'
  });

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const { loading, error, data, refetch } = useGetBooksQuery({
    variables: { 
      filter: {
        searchTerm: filters.searchTerm,
        filterBy: filters.filterBy,
        startDate: filters?.dateRange?.start || "",
        endDate: filters?.dateRange?.end || ""
      },
      limit: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE
    }
  });

  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setIsSearching(true);
    refetch({
      filter: {
        searchTerm: newFilters.searchTerm,
        filterBy: newFilters.filterBy,
        ...(newFilters.filterBy === 'date' && newFilters.dateRange && {
          startDate: newFilters.dateRange.start,
          endDate: newFilters.dateRange.end
        })
      }
    }).finally(() => setIsSearching(false));
  };

  const filteredBooks = useMemo(() => {
    if (!data?.books) return [];

    return data.books.books.filter((book: any) => {
      if (!filters.searchTerm) return true;

      const searchTerm = filters.searchTerm.toLowerCase();

      switch (filters.filterBy) {
        case 'title':
          return book.title.toLowerCase().includes(searchTerm);
        case 'author':
          return book.author.name.toLowerCase().includes(searchTerm);
        case 'date':
          if (!filters.dateRange?.start || !filters.dateRange?.end) return true;
          const bookDate = new Date(Number(book.publishedDate));
          const startDate = new Date(filters.dateRange.start);
          const endDate = new Date(filters.dateRange.end);
          return bookDate >= startDate && bookDate <= endDate;
        default:
          return true;
      }
    });
  }, [data?.books, filters]);

  if (loading) return (
    <div>
      <div className="h-10 w-full mb-8 bg-gray-200 animate-pulse rounded-md"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="aspect-[3/4] bg-gray-200 animate-pulse rounded-md mb-4"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 animate-pulse rounded-md w-3/4"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded-md w-1/2"></div>
            </div>
            <div className="h-16 bg-gray-200 animate-pulse rounded-md mt-4"></div>
            <div className="flex gap-2 mt-4">
              <div className="h-6 w-16 bg-gray-200 animate-pulse rounded-full"></div>
              <div className="h-6 w-16 bg-gray-200 animate-pulse rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  if (error) {
    return (
      <Container size="3">
        <Card size="3" className="p-8 text-center bg-red-50">
          <Flex direction="column" align="center" gap="4">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <div>
              <Heading size="6" className="mb-2 text-red-700">
                Error Loading Books
              </Heading>
              <Text color="red" size="2">
                {error.message}
              </Text>
            </div>
          </Flex>
        </Card>
      </Container>
    );
  }

  if (!data?.books?.books?.length) {
    return (
      <Container size="3">
        <Card size="3" className="p-8 text-center">
          <Flex direction="column" align="center" gap="4">
            <BookIcon className="w-12 h-12 text-gray-400" />
            <div>
              <Heading size="6" className="mb-2">
                Coming Soon
              </Heading>
              <Text color="gray" size="2" className="mb-4">
                Our library is currently being curated. Check back soon for an amazing collection of books!
              </Text>
              <br/>
              <Text color="blue" size="2">
                Are you an author? <LinkTheme href="/signup" className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">Sign up</LinkTheme> or <LinkTheme href="/login" className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">log in</LinkTheme> to publish your books and reach new readers.
              </Text>
            </div>
          </Flex>
        </Card>
      </Container>
    );
  }

  return (
    <div>
      <SearchBar onSearch={handleSearch} isLoading={isSearching} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.books?.books?.map((book: any) => (
          <Link href={`/books/${book.id}`} key={book.id}>
            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <Flex direction="column" gap="3">
                <div className="aspect-[3/4] relative overflow-hidden rounded-md">
                  <img
                    src={book.image || 'https://via.placeholder.com/150'}
                    alt={book.title}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div>
                  <Text size="5" weight="bold" className="line-clamp-1">
                    {book.title}
                  </Text>
                  <Text size="2" color="gray">
                    by {book.author.name}
                  </Text>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(book.averageRating || 0)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      ({book.totalReviews} {book.totalReviews === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                </div>

                <Text className="line-clamp-2 text-gray-600" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(book.description) }} />

                <Flex gap="2" mt="2">
                  <Badge color="blue">
                    {new Date(Number(book.publishedDate)).getFullYear()}
                  </Badge>
                </Flex>
              </Flex>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {page} of {Math.ceil((data?.books?.total || 0) / ITEMS_PER_PAGE)}
        </span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page >= Math.ceil((data?.books?.total || 0) / ITEMS_PER_PAGE)}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}