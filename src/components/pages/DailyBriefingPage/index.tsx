import { useState, lazy, Suspense } from 'react';
import { useNewsletterSections } from '@/hooks/useNewsletterSections';
import DailyBriefingSection from './DailyBriefingSection';
import { format } from 'date-fns';
import { FiCalendar } from 'react-icons/fi';
import AdBanner from '@/components/atoms/AdBanner';

const NewsletterSubscription = lazy(() => import('@/components/newsletter/NewsletterSubscription'));

interface DailyBriefingPageProps {
  darkMode: boolean;
}

export default function DailyBriefingPage({ darkMode }: DailyBriefingPageProps) {

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { sections, loading, error, toggleSection } = useNewsletterSections({ date: selectedDate });

  // Handle date change from input
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const date = new Date(e.target.value);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
      }
    }
  };

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
        <h2 className="text-xl font-semibold text-red-500 mb-2">Error loading daily briefing</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Check if there's any content in any section
  const hasContent = sections.some(section => 
    section.content.news && section.content.news.length > 0
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <AdBanner position="top" />

      {/* Centered Date Picker Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm py-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => {
                const prevDay = new Date(selectedDate);
                prevDay.setDate(prevDay.getDate() - 1);
                setSelectedDate(prevDay);
              }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Previous day"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
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
            
            <button
              onClick={() => {
                const nextDay = new Date(selectedDate);
                nextDay.setDate(nextDay.getDate() + 1);
                
                // Don't allow going past today
                if (nextDay <= new Date()) {
                  setSelectedDate(nextDay);
                }
              }}
              disabled={format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')}
              className={`p-2 rounded-full transition-colors ${
                format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              aria-label="Next day"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {hasContent ? (
          <div className="space-y-6">
            {sections.map((section) => (
              <DailyBriefingSection
                key={section.id}
                section={{
                  ...section,
                  content: section.content.news || []
                }}
                onToggle={toggleSection}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">브리핑 정보가 없습니다</h3>
            <p className="text-gray-500 dark:text-gray-400">
              선택하신 날짜({format(selectedDate, 'yyyy년 MM월 dd일')})의 브리핑 정보가 없습니다.
            </p>
          </div>
        )}

        {/* Newsletter Subscription Section */}
        <div className="pt-10">
          <Suspense fallback={
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 animate-pulse h-64">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-10 bg-blue-200 dark:bg-blue-900 rounded"></div>
            </div>
          }>
            <NewsletterSubscription />
          </Suspense>
        </div>

        <AdBanner position="bottom" />
      </div>
    </div>
  );
}
