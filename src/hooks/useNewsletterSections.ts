import { useState, useEffect } from 'react';
import { fetchDailyBriefing, NewsletterSection } from '@/lib/api';

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  published_at: string;
  url: string;
  summary?: string;
}

export interface NewsSection {
  id: string;
  section_name: string;
  section_title: string;
  summary: string;
  content: Array<{
    id: number;
    title: string;
    source: string;
    published_at: string | null;
    url: string;
  }>;
  isExpanded: boolean;
}

interface UseNewsletterSectionsProps {
  date?: Date;
}

export const useNewsletterSections = ({ date = new Date() }: UseNewsletterSectionsProps = {}) => {
  const [sections, setSections] = useState<NewsSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const toggleSection = (sectionId: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    );
  };

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        const data = await fetchDailyBriefing(date);
        
        // Transform the API data to match our frontend structure
        const formattedSections: NewsSection[] = data.map((section) => ({
          id: section.id,
          section_name: section.section_name,
          section_title: section.section_title,
          summary: section.summary,
          content: section.content || [],
          isExpanded: true
        }));

        setSections(formattedSections);
      } catch (err) {
        console.error('Error fetching sections:', err);
        setError(err instanceof Error ? err : new Error('An error occurred while fetching sections'));
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [date]); // Add date to dependency array

  return {
    sections,
    loading,
    error,
    toggleSection,
  };
};

// Helper function to get emoji based on section name
const getEmojiForSection = (sectionName: string): string => {
  const emojiMap: Record<string, string> = {
    launches: '🚀',
    updates: '🛠️',
    investment: '📊',
    infrastructure: '⚙️',
    trends: '📈',
  };
  return emojiMap[sectionName] || '📰';
};
