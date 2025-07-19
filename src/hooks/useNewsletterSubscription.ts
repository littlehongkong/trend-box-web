import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useNewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const subscribe = async (email: string) => {
    if (!email) {
      setError('이메일을 입력해주세요.');
      return false;
    }

    // Gmail 주소만 허용하는 검증
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      setError('Gmail 주소만 등록이 가능합니다.');
      return false;
    }

    setStatus('loading');
    setError(null);

    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .upsert(
          { 
            email: email.toLowerCase().trim(),
            is_active: true,
            subscription_source: 'daily_briefing_page',
            unsubscribed_at: null
          },
          { onConflict: 'email' }
        );

      if (error) throw error;
      
      setStatus('success');
      return true;
    } catch (err) {
      console.error('Error subscribing to newsletter:', err);
      setError('구독 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setStatus('error');
      return false;
    }
  };

  const unsubscribe = async (email: string) => {
    if (!email) return false;

    setStatus('loading');
    setError(null);

    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({ 
          is_active: false,
          unsubscribed_at: new Date().toISOString()
        })
        .eq('email', email.toLowerCase().trim());

      if (error) throw error;
      
      setStatus('unsubscribed');
      return true;
    } catch (err) {
      console.error('Error unsubscribing from newsletter:', err);
      setError('구독 해지 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setStatus('error');
      return false;
    }
  };

  return {
    email,
    setEmail,
    status,
    error,
    subscribe,
    unsubscribe,
    reset: () => {
      setStatus('idle');
      setError(null);
    }
  };
};
