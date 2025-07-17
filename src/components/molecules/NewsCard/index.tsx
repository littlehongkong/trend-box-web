import React from 'react';
import { NewsItem } from '@/types';

interface NewsCardProps {
  item: NewsItem;
}

type CategoryColors = {
  [key: string]: string;
  API: string;
  Model: string;
  SDK: string;
  Platform: string;
  Framework: string;
  Funding: string;
};

const getCategoryColor = (category: string) => {
  const colors: CategoryColors = {
    'API': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'Model': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'SDK': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'Platform': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    'Framework': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    'Funding': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  };
  return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4">
        {/* Title */}
        <a 
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-3 group"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">
            {item.title}
          </h3>
        </a>

        {/* Description
        <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed mb-3">
          {item.description}...
        </p>
        */}

        {/* Why Developers Care (Optional) */}
        {item.whyDevelopersCare && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2 mb-3">
            <p className="text-yellow-800 dark:text-yellow-200 text-xs italic leading-relaxed">
              💡 {item.whyDevelopersCare}
            </p>
          </div>
        )}

        {/* Category Tags */}
        <div className="flex items-center space-x-2 mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
            {item.category}
          </span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
            {item.subcategory}
          </span>
        </div>

        {/* Source and Time */}
        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className="font-medium">{item.source}</span>
          <span className="flex items-center space-x-1">
            <i className="ri-time-line text-xs"></i>
            <span 
              className="cursor-help"
              title={item.publishedAt}
            >
              {new Date(item.publishedAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </span>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
