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
          // 선택한 날짜를 KST로 간주하고 UTC로 변환
          const year = selectedDate.getFullYear();
          const month = selectedDate.getMonth();
          const day = selectedDate.getDate();
          
          // KST 00:00:00 (선택한 날짜) = UTC 15:00:00 (전날)
          const utcStart = new Date(Date.UTC(year, month, day - 1, 15, 0, 0, 0));
          // KST 23:59:59.999 (선택한 날짜) = UTC 14:59:59.999 (당일)
          const utcEnd = new Date(Date.UTC(year, month, day, 14, 59, 59, 999));
          
          console.log('Selected date (local):', selectedDate);
          console.log('KST Range:', 
            new Date(Date.UTC(year, month, day, 0, 0, 0, 0) - (9 * 60 * 60 * 1000)), 
            'to', 
            new Date(Date.UTC(year, month, day, 23, 59, 59, 999) - (9 * 60 * 60 * 1000))
          );
          console.log('UTC Range for query:', utcStart.toISOString(), 'to', utcEnd.toISOString());
          
          // UTC 범위로 필터링
          query = query
            .gte('pub_date', utcStart.toISOString())
            .lte('pub_date', utcEnd.toISOString())
            .order('pub_date', { ascending: false });
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
