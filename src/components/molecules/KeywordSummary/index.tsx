import React from 'react';

interface KeywordSummaryProps {
  keywords: string[];
  selectedKeywords?: string[];
  onKeywordClick?: (keyword: string) => void;
  title?: string;
  className?: string;
}

const KeywordSummary: React.FC<KeywordSummaryProps> = ({ 
  keywords, 
  selectedKeywords = [], 
  onKeywordClick, 
  title = "Today's AI Keywords",
  className = '' 
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 border border-gray-200 dark:border-gray-700 ${className}`}>
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => {
          const isSelected = selectedKeywords.some(k => k.toLowerCase() === keyword.toLowerCase());
          return (
            <span 
              key={index}
              onClick={() => onKeywordClick?.(keyword)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer
                ${isSelected 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}
              `}
            >
              {keyword}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default KeywordSummary;
