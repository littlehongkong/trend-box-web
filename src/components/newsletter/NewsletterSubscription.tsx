import React, { useState, useEffect } from 'react';
import { useNewsletterSubscription } from '@/hooks/useNewsletterSubscription';

const NewsletterSubscription = () => {
  const { email, setEmail, status, error, subscribe, unsubscribe } = useNewsletterSubscription();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showUnsubscribe, setShowUnsubscribe] = useState(false);

  // Check if email is already subscribed
  useEffect(() => {
    const checkSubscription = async () => {
      const email = localStorage.getItem('subscribedEmail');
      if (email) {
        setEmail(email);
        setIsSubscribed(true);
      }
    };
    checkSubscription();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await subscribe(email);
    if (success) {
      localStorage.setItem('subscribedEmail', email);
      setIsSubscribed(true);
    }
  };

  const handleUnsubscribe = async () => {
    const currentEmail = email; // Store the email before clearing it
    const success = await unsubscribe(currentEmail);
    if (success) {
      localStorage.removeItem('subscribedEmail');
      setShowUnsubscribe(false);
      setIsSubscribed(false);
      // Don't clear email here to show it in the success message
      
      // 성공 메시지를 잠시 보여준 후 초기 상태로 복귀
      setTimeout(() => {
        setStatus('idle');
        setEmail(''); // Clear email after showing success message
      }, 3000);
    }
  };

  // 구독 해지 성공 메시지 표시
  if (status === 'unsubscribed') {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
        <div className="flex flex-col items-center">
          <svg
            className="w-12 h-12 text-blue-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">구독이 해지되었습니다</h3>
          <p className="text-blue-600 dark:text-blue-300 mb-4">
            {email}으로의 뉴스레터 발송이 중단되었습니다.
            <br />
            언제든지 다시 구독하실 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  if (isSubscribed && !showUnsubscribe) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <div className="flex flex-col items-center text-center">
          <svg
            className="w-12 h-12 text-green-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">구독 완료!</h3>
          <p className="text-green-600 dark:text-green-300 mb-6">
            {email}으로 뉴스레터 구독이 완료되었습니다.
            <br />
            매일 아침 8시, 최신 트렌드 뉴스를 이메일로 받아보실 수 있습니다.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button
              onClick={() => setShowUnsubscribe(true)}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              구독 해지하기
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('subscribedEmail');
                setIsSubscribed(false);
                setEmail('');
              }}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              이메일 추가하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showUnsubscribe) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          ※ Gmail 주소만 등록이 가능합니다.
        </p>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          정말 구독을 해지하시겠어요? 😢
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
          {email}으로 발송되는 뉴스레터 구독을 해지하시면 더 이상 최신 트렌드 뉴스를 받아보실 수 없습니다.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleUnsubscribe}
            disabled={status === 'loading'}
            className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center justify-center min-w-[120px] ${
              status === 'loading'
                ? 'bg-red-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {status === 'loading' ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                처리 중...
              </>
            ) : '네, 해지할게요'}
          </button>
          <button
            onClick={() => setShowUnsubscribe(false)}
            disabled={status === 'loading'}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            취소하기
          </button>
        </div>
        
        {error && (
          <p className="text-red-500 text-sm mt-3">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
        📧 매일 아침, 핵심 트렌드 뉴스레터 받아보기
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
        오늘의 주요 트렌드 뉴스를 이메일로 받아보세요. 매일 아침 8시, 최신 트렌드를 한눈에 확인하실 수 있습니다.
      </p>
      
      <form onSubmit={handleSubscribe} className="space-y-3">
        <div>
          <label htmlFor="email" className="sr-only">이메일 주소</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@gmail.com"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={status === 'loading'}
          />
          <div className="mt-2">
            <div className="flex items-center text-red-500 dark:text-red-400">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Gmail 주소만 등록이 가능합니다.</span>
            </div>
          </div>
        </div>
        
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
        
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            status === 'loading'
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {status === 'loading' ? '처리 중...' : '무료로 구독하기'}
        </button>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
          언제든지 구독을 취소하실 수 있습니다.
        </p>
      </form>
    </div>
  );
};

export default NewsletterSubscription;
