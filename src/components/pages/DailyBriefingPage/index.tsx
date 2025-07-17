import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNewsletterSections } from '@/hooks/useNewsletterSections';
import DailyBriefingSection from './DailyBriefingSection';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import AdBanner from '@/components/atoms/AdBanner';

interface DailyBriefingPageProps {
  darkMode: boolean;
}

export default function DailyBriefingPage({ darkMode, onToggleDarkMode }: DailyBriefingPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { sections, loading, error, toggleSection } = useNewsletterSections({ date: selectedDate });
  
  // Format the date for display
  const formattedDate = format(selectedDate, 'yyyy년 MM월 dd일 (EEE)', { locale: ko });

  const handleDateIncrement = (increment: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + increment);
    setSelectedDate(newDate);
  };
  
  // Format the date for display
  const formatDateForDisplay = (date: Date) => {
    return format(date, 'yyyy년 MM월 dd일 (EEE)', { locale: ko });
  };

  const formatDateForInput = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
  };

  // Handle date change from input
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const date = new Date(e.target.value);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
      }
    }
  };

  // Navigate to home page
  const handleNavigateHome = () => {
    navigate('/');
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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <AdBanner position="top" />

      {/* Centered Date Picker Section */}
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

      <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Content Section

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleDateIncrement(-1)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Previous day"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium">{format(selectedDate, 'yyyy년 MM월 dd일 (EEE)', { locale: ko })}</span>
            <button
              onClick={() => handleDateIncrement(1)}
              disabled={format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        */}

        <div className="space-y-6">
          {sections.map((section) => (
            <DailyBriefingSection
              key={section.id}
              section={section}
              onToggle={toggleSection}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
