import { useState, useEffect } from 'react';
import { fetchDailyBriefing } from '@/lib/api';

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  published_at: string;
  url: string;
  summary?: string;
  category?: string;
  subcategory?: string;
}

export interface NewsSection {
  id: string;
  section_name: string;
  section_title: string;
  summary: string;
  content: {
    news: NewsItem[];
  };
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
          content: {
            news: Array.isArray(section.content) ? section.content : []
          },
          isExpanded: false
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


