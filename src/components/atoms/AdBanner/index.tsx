import React from 'react';

interface AdBannerProps {
  position: 'top' | 'bottom';
}

const AdBanner: React.FC<AdBannerProps> = ({ position }) => {
  const gradient = position === 'top' 
    ? 'from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-b'
    : 'from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border-t';

  return (
    <div className={`w-full h-16 ${gradient} flex items-center justify-center border-gray-200 dark:border-gray-700 ${position === 'bottom' ? 'mt-8' : ''}`}>
      <span className="text-xs text-gray-500 dark:text-gray-400">Advertisement</span>
    </div>
  );
};

export default AdBanner;
