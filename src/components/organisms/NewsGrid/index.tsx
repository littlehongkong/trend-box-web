import React from 'react';
import NewsCard from '@/components/molecules/NewsCard';
import { NewsItem } from '@/types';

interface NewsGridProps {
  newsItems: NewsItem[];
  categories?: string[];
  sources?: string[];
  className?: string;
  emptyMessage?: string;
}

const NewsGrid: React.FC<NewsGridProps> = ({ 
  newsItems = [], 
  className = '',
  emptyMessage = '표시할 뉴스가 없습니다.'
}) => {
  if (!newsItems || newsItems.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {newsItems.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default NewsGrid;
