'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState, Suspense } from 'react';

const PageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [contentType, setContentType] = useState('');
  const [websiteContent, setWebsiteContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const usernameParam = searchParams.get('username');
    const contentTypeParam = searchParams.get('contentType');
    setUsername(usernameParam || '');
    setContentType(contentTypeParam || '');

    // Fetch website content from API
    if (usernameParam && contentTypeParam) {
      setIsLoading(true);
      fetch(`/api/website?username=${usernameParam}&contentType=${contentTypeParam}`)
        .then(response => response.json())
        .then(data => {
          setWebsiteContent(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching website content:', error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  const handleNavClick = (newContentType) => {
    router.push(`/website?username=${username}&contentType=${newContentType}`);
  };

  return (
    <div>
      <nav className="bg-gray-800 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              <div className="flex items-center py-4">
                <span className="font-semibold text-white text-lg">{username}'s Site</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <button onClick={() => handleNavClick('home')} className="py-4 px-2 text-gray-300 hover:text-white transition duration-300">Home</button>
              <button onClick={() => handleNavClick('contact')} className="py-4 px-2 text-gray-300 hover:text-white transition duration-300">Contact</button>
              <button onClick={() => handleNavClick('about_us')} className="py-4 px-2 text-gray-300 hover:text-white transition duration-300">About Us</button>
              <button onClick={() => handleNavClick('services')} className="py-4 px-2 text-gray-300 hover:text-white transition duration-300">Services</button>
            </div>
          </div>
        </div>
      </nav>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      ) : websiteContent ? (
        <div>
          <style dangerouslySetInnerHTML={{ __html: websiteContent.css }} />
          <div dangerouslySetInnerHTML={{ __html: websiteContent.html }} />
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-600">No content available for this section.</p>
        </div>
      )}
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
};

export default Page;
