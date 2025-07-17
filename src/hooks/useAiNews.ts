import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface AiNews {
  id: number;
  title: string;
  summary: string | null;
  url: string;
  keyword: string | null;
  pub_date: string | null;
  created_at: string;
  source: string | null;
  description: string | null;
  category: string | null;
  subcategory: string | null;
}

export const useAiNews = (selectedDate?: Date) => {
  const [news, setNews] = useState<AiNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        console.log('Fetching news for date:', selectedDate);
        
        let query = supabase
          .from('ai_news')
          .select('*')
          .order('pub_date', { ascending: false });
          
        if (selectedDate) {
          // Set the start of the selected day in UTC
          const startDate = new Date(selectedDate);
          startDate.setUTCHours(0, 0, 0, 0);
          
          // Set the end of the selected day in UTC
          const endDate = new Date(selectedDate);
          endDate.setUTCHours(23, 59, 59, 999);
          
          query = query
            .gte('pub_date', startDate.toISOString())
            .lte('pub_date', endDate.toISOString());
        }
        
        const { data, error } = await query;

        if (error) throw error;
        
        console.log('Fetched data:', data);
        setNews(data || []);
      } catch (err) {
        console.error('Error fetching AI news:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch news'));
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedDate]); // Add selectedDate to dependency array

  return { news, loading, error };
};
