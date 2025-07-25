interface NewsItem {
  id: string;
  title: string;
  title_kr?: string;
  source: string;
  published_at: string | null;
  url: string;
  summary?: string;
  category?: string;
  subcategory?: string;
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
      <div className="px-6 pt-4">
        <h2 className="text-xl font-semibold">{section_title}</h2>
        
        {summary ? (
          <div className="my-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
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
        ) : (
          <div className="my-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                이 섹션에 대한 요약 정보는 데이터 부족으로 제공되지 않습니다.
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-6">
          <div 
            className="flex items-center justify-between mb-3 cursor-pointer"
            onClick={() => onToggle(id)}
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">관련 뉴스</h3>
            {news.length > 3 && (
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mr-1">
                  {isExpanded ? '접기' : `전체 ${news.length}개 보기`}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="space-y-2">
              {news.slice(0, isExpanded ? news.length : 3).map((item, index) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start p-3 -mx-2 rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/70 hover:shadow-sm"
                >
                  <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 mt-0.5 mr-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {item.title_kr || item.title}
                    </h4>
                    {item.published_at && (
                      <div className="mt-1.5 flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <svg className="w-3.5 h-3.5 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <time dateTime={item.published_at}>
                          {formatDate(item.published_at)}
                        </time>
                      </div>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 mt-1 flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              ))}
            </div>
            
            {news.length > 3 && (
              <div className="pt-1">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggle(id);
                  }}
                  className="w-full py-2 px-4 text-sm font-medium text-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800/50"
                >
                  {isExpanded ? (
                    <span className="inline-flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      접기
                    </span>
                  ) : (
                    <span>+ {news.length - 3}개 더 보기</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
