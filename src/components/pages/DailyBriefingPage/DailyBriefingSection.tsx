import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface NewsItem {
  id: number;
  title: string;
  source: string;
  published_at: string | null;
  url: string;
}

interface DailyBriefingSectionProps {
  section: {
    id: string;
    section_name: string;
    section_title: string;
    summary: string;
    content: NewsItem[];
    isExpanded: boolean;
  };
  onToggle: (id: string) => void;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export default function DailyBriefingSection({ section, onToggle }: DailyBriefingSectionProps) {
  const { id, section_title, summary, content: news, isExpanded } = section;

  return (
    <div className="mb-6 border rounded-lg overflow-hidden shadow-sm dark:border-gray-700">
      <button
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        onClick={() => onToggle(id)}
      >
        <h2 className="text-xl font-semibold">{section_title}</h2>
        <svg
          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="px-6 pb-4">
          {summary && (
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                {summary.split('\n').map((line, i) => (
                  <span key={i} className="block mb-2 last:mb-0">
                    {line.startsWith('•') ? (
                      <span className="flex">
                        <span className="mr-2">•</span>
                        <span>{line.substring(1).trim()}</span>
                      </span>
                    ) : (
                      line
                    )}
                  </span>
                ))}
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            {news.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700 transition-colors"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span>{item.source}</span>
                  {item.published_at && (
                    <span className="mx-2">•</span>
                  )}
                  {formatDate(item.published_at) && (
                    <span>{formatDate(item.published_at)}</span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
