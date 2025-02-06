import { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

export interface SearchFilters {
  searchTerm: string;
  filterBy: 'title' | 'author' | 'date';
  dateRange?: {
    start?: string;
    end?: string;
  };
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'title' | 'author' | 'date'>('title');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isDateRangeVisible, setIsDateRangeVisible] = useState(false);

  const isSearchDisabled = isLoading || 
    (filterBy === 'date' && (!dateRange.start || !dateRange.end));

  const handleSearch = () => {
    if (isSearchDisabled) return;
    
    onSearch({
      searchTerm,
      filterBy,
      ...(filterBy === 'date' && { dateRange })
    });
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search books..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            disabled={isLoading}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={filterBy}
            onChange={(e) => {
              setFilterBy(e.target.value as 'title' | 'author' | 'date');
              setIsDateRangeVisible(e.target.value === 'date');
              setSearchTerm(''); // Clear search term when switching filters
            }}
            disabled={isLoading}
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="date">Date</option>
          </select>

          <button
            onClick={handleSearch}
            disabled={isSearchDisabled}
            className={`px-6 py-2 rounded-md flex items-center space-x-2
              ${isSearchDisabled 
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'} 
              text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Searching...</span>
              </>
            ) : (
              <span>Search</span>
            )}
          </button>
        </div>
      </div>

      {isDateRangeVisible && (
        <div className="mt-4 flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              disabled={isLoading}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              disabled={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
} 