import { useState, useMemo } from 'react';
import AdBanner from '@/components/atoms/AdBanner';
import KeywordSummary from '@/components/molecules/KeywordSummary';
import NewsGrid from '@/components/organisms/NewsGrid';
import { useAiNews } from '@/hooks/useAiNews';
import { NewsItem } from '@/types';
import { format } from 'date-fns';
import { FiCalendar } from 'react-icons/fi';

interface HomePageProps {
  darkMode: boolean;
}

const HomePage = ({ darkMode }: HomePageProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const { news, loading, error } = useAiNews(selectedDate);

  // Function to clean HTML entities and source information from text
  const cleanHtmlEntities = (text: string, isTitle: boolean = false): string => {
    if (!text) return '';

    // For titles, remove source information at the end (e.g., " - 출처명" or " - Source Name")
    if (isTitle) {
      text = text.replace(/\s*-\s*[^-]*$/, '').trim();
    }

    // Remove everything after &nbsp;&nbsp; (including the &nbsp;&nbsp;)
    const cleanedText = text.split('&nbsp;&nbsp;')[0];

    // Replace common HTML entities
    return cleanedText
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lsquo;|&rsquo;/g, "'")
      .replace(/&ldquo;|&rdquo;/g, '"')
      .replace(/&#x27;/g, "'")
      .trim();
  };

  
  // Process news items with null checks and map to expected format
  const processedNews = useMemo(() => {
    return (news || []).map(item => ({
      id: item.id,
      title: cleanHtmlEntities(item.title || '', true),
      description: cleanHtmlEntities(item.description || ''),
      sourceUrl: item.url || '',
      category: item.category || '',
      subcategory: item.subcategory || '',
      source: item.source || '',
      publishedAt: item.pub_date
    }));
  }, [news]);

  // Filter news based on selected keywords
  const filteredNews = useMemo(() => {
    if (selectedKeywords.length === 0) return processedNews;
    
    return processedNews.filter(item => {
      const itemText = `${item.title} ${item.description}`.toLowerCase();
      return selectedKeywords.some(keyword => 
        itemText.includes(keyword.toLowerCase())
      );
    });
  }, [processedNews, selectedKeywords]);

  // Toggle keyword selection
  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev => {
      const lowerKeyword = keyword.toLowerCase();
      if (prev.some((k: string) => k.toLowerCase() === lowerKeyword)) {
        return prev.filter((k: string) => k.toLowerCase() !== lowerKeyword);
      }
      return [...prev, keyword];
    });
  };

  // Clear all selected keywords
  const clearKeywords = () => {
    setSelectedKeywords([]);
  };



  // Add loading state for news data
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Debug log raw news data
  console.log('Raw news data:', news);

  // Processed news is now defined above in useMemo

  // Extract unique categories with null checks
  const categories = [...new Set(processedNews
    .map(item => item?.category)
    .filter(Boolean)
  )];

  // Extract unique sources with null checks
  const sources = [...new Set(processedNews
    .map(item => item?.source)
    .filter(Boolean)
  )];

  // Get trending keywords with null checks
  const trendingKeywords = processedNews.length > 0 
    ? Array.from(
        processedNews
          .filter(item => item?.title) // Filter out items without title
          .flatMap(item => {
            // Remove common patterns that don't add value
            const cleanText = `${item.title} ${item.description}`
              .replace(/By\s+[A-Za-z\s]+$/g, '') // Remove 'By Author' at end
              .replace(/\d+일\s*만에\s*\d+[kK][gG]\s*감량/g, '') // Remove weight loss patterns
              .replace(/[0-9]+[kK][gG]\s*[감량|감소|줄이기]/g, '') // More weight loss patterns
              .replace(/[0-9]+[kK][gG]/g, '') // Any remaining kg patterns
              .replace(/\d+[일|시간|분|초|개월|년]/g, '') // Remove time/date patterns
              .toLowerCase();
            
            // Extract meaningful words (Korean, English, numbers with units)
            const words = cleanText.match(/[가-힣a-zA-Z0-9%]+/g) || [];
            
            // Process individual words with better filtering
            const processedWords = words
              .map(word => {
                // Skip common patterns
                if (/^by$/i.test(word)) return null;
                
                // Normalize variations
                const normalized = word
                  .replace(/[^가-힣a-zA-Z0-9%]/g, '') // Keep only alphanumeric and %
                  .replace(/[은는이가을를에의과와으로부터에서한테도만요]$/, '');
                
                // Skip if too short after normalization
                if (normalized.length < 2) return null;
                
                // Standardize common terms
                if (['챗gpt', 'chatgpt', 'chat gpt', 'gpt'].some(term => normalized.includes(term))) return 'ChatGPT';
                if (['ai', '인공지능'].includes(normalized)) return 'AI';
                if (['오픈ai', 'openai', 'open ai'].includes(normalized)) return 'OpenAI';
                if (['aws', 'amazon web service'].includes(normalized)) return 'AWS';
                if (['gpt4', 'gpt-4', 'gpt 4'].includes(normalized)) return 'GPT-4';
                
                return normalized;
              })
              .filter(word => {
                if (!word) return false;
                
                // Filter criteria
                const commonWords = new Set([
                  // English common words
                  'this', 'that', 'with', 'from', 'have', 'they', 'their', 'what', 'your', 'will', 'would', 'about', 'which', 'when', 'also', 'more', 'and', 'the', 'for', 'are', 'was', 'were', 'has', 'had', 'not', 'its', 'can', 'will', 'all', 'any', 'but', 'did', 'get', 'has', 'her', 'him', 'his', 'how', 'its', 'let', 'our', 'out', 'see', 'the', 'too', 'use', 'via', 'you', 'your', 'com', 'net', 'org', 'co', 'kr', 'www', 'http', 'https', 'html', 'com', 'net', 'org', 'co', 'kr', 'www', 'http', 'https', 'html',
                  // Korean common words
                  '그', '이', '저', '것', '수', '등', '및', '또는', '그리고', '에서', '이다', '있다', '없다', '같다', '된다', 'vs', '시키는', '하는', '한', '된', '인', '할', '하고', '보다', '까지', '부터', '처럼', '같은', '라는', '에는', '에서', '으로', '했더니', '무하유', '카피킬러', '에', '를', '을', '이', '가', '은', '는', '의', '과', '와', '으로', '에서', '한테', '도', '만', '요', '으로부터', '처럼', '같이', '처럼', '만큼', '처럼', '같이', '처럼', '만큼', '처럼', '같이', '처럼', '만큼'
                ]);
                
                const isCommonWord = commonWords.has(word);
                const isTooShort = word.length < 2 || (/^[a-z]+$/.test(word) && word.length < 3);
                const isNumberOnly = /^\d+$/.test(word);
                const isSingleChar = /^[a-zA-Z]$/.test(word);
                const isURLPart = /^(http|www|\.com|\.co\.|\.net|\/)/.test(word);
                
                return !isCommonWord && !isTooShort && !isNumberOnly && !isSingleChar && !isURLPart;
              });
              
            return processedWords;
          })
          .reduce((acc, word) => {
            if (!word) return acc;
            
            // Skip if word is too generic or part of a phrase we've already seen
            const isPartOfPhrase = Array.from(acc.keys()).some(phrase => 
              phrase.includes(word) && phrase !== word
            );
            
            if (!isPartOfPhrase) {
              acc.set(word, (acc.get(word) || 0) + 1);
            }
            
            return acc;
          }, new Map()),
        ([word, count]) => ({
          word: word
            .split(' ')
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' '),
          count
        })
      )
        .sort((a, b) => b.count - a.count)
        .filter(({ word }) => {
          // Final filtering of results
          const lowerWord = word.toLowerCase();
          const isTrash = [
            '카피킬러', '무하유', '에', '를', '을', '이', '가', '은', '는', '의', '과', '와', '으로', '에서', '한테', '도', '만', '요', '으로부터', '처럼', '같이', '처럼', '만큼', '처럼', '같이', '처럼', '만큼', '처럼', '같이', '처럼', '만큼', 'investing', 'com', 'by', '1급', '2급', '3급', '과정', '실전', '지도사', '인공지능 지도사', '챗gpt 인공지능 지도사', '46일 만에 11kg', '46일', '11kg', '만에'
          ].some(term => lowerWord.includes(term.toLowerCase()));
          
          return word && word.trim().length > 0 && !isTrash;
        })
        .slice(0, 8) // Further reduce to 8 keywords for better quality
    : []; // Return empty array if no processed news

  // Handle date change from input
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const date = new Date(e.target.value);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
      }
    }
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-red-500 mb-2">Error loading news</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Failed to load the latest AI news. Please try again later.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <AdBanner position="top" />
      
      {/* Date Picker Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm py-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="relative" style={{ width: '240px' }}>
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={handleDateChange}
                max={format(new Date(), 'yyyy-MM-dd')}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Trending Keywords */}
        <div className="mb-8">
          <KeywordSummary 
            keywords={trendingKeywords.map(kw => kw.word)} 
            selectedKeywords={selectedKeywords}
            onKeywordClick={toggleKeyword}
            title="Trending Keywords"
            className="mb-2"
          />
          {selectedKeywords.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4 px-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">선택된 키워드:</span>
              {selectedKeywords.map(keyword => (
                <span 
                  key={keyword}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  onClick={() => toggleKeyword(keyword)}
                >
                  {keyword}
                  <span className="ml-1.5">×</span>
                </span>
              ))}
              <button 
                onClick={clearKeywords}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 ml-2"
              >
                모두 지우기
              </button>
            </div>
          )}
        </div>

        {/* News Grid */}
        <NewsGrid 
          newsItems={filteredNews.filter((item): item is NewsItem & { publishedAt: string } => item.publishedAt !== null)} 
          categories={categories} 
          sources={sources} 
          className="mb-12"
          emptyMessage={selectedKeywords.length > 0 ? "선택한 키워드에 해당하는 뉴스가 없습니다." : "뉴스가 없습니다."}
        />
      </main>
      <AdBanner position="bottom" />
    </div>
  );
};

export default HomePage;
