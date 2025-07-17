import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from('newsletter_sections')
      .select('*')
      .gte('publish_date', today.toISOString())
      .lte('publish_date', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString())
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching newsletter sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletter sections' },
      { status: 500 }
    );
  }
}
