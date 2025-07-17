import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

console.log('Initializing Supabase with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

export interface NewsletterSection {
  id: string;
  section_name: string;
  section_title: string;
  summary: string;
  content: {
    news: Array<{
      id: string;
      title: string;
      summary?: string;
      source?: string;
      published_at?: string;
      url?: string;
    }>;
  };
  publish_date: string;
  is_published: boolean;
  display_order: number;
}

export const fetchDailyBriefing = async (date: Date = new Date()): Promise<NewsletterSection[]> => {
  try {
    console.log('Fetching daily briefing for date:', date);
    
    // Format date as yyyymmdd
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    const { data, error } = await supabase
      .from('newsletter_sections')
      .select('*')
      .eq('publish_date', formattedDate)
//       .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Fetched data:', data);
    return data || [];
  } catch (error) {
    console.error('Error in fetchDailyBriefing:', error);
    throw error;
  }
};
