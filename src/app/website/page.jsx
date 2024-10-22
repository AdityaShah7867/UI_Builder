'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [contentType, setContentType] = useState('');
  const [websiteContent, setWebsiteContent] = useState(null);

  useEffect(() => {
    const usernameParam = searchParams.get('username');
    const contentTypeParam = searchParams.get('contentType');
    setUsername(usernameParam || '');
    setContentType(contentTypeParam || '');

    // Fetch website content from API
    if (usernameParam && contentTypeParam) {
      fetch(`http://localhost:3000/api/website?username=${usernameParam}&contentType=${contentTypeParam}`)
        .then(response => response.json())
        .then(data => setWebsiteContent(data))
        .catch(error => console.error('Error fetching website content:', error));
    }
  }, [searchParams]);

  const handleNavClick = (newContentType) => {
    router.push(`/website?username=${username}&contentType=${newContentType}`);
  };

  return (
    <div>
      <nav style={{ backgroundColor: '#f8f9fa', padding: '10px 0' }}>
        <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'center', margin: 0, padding: 0 }}>
          <li style={{ margin: '0 10px' }}><button onClick={() => handleNavClick('home')}>Home</button></li>
          <li style={{ margin: '0 10px' }}><button onClick={() => handleNavClick('contact')}>Contact</button></li>
          <li style={{ margin: '0 10px' }}><button onClick={() => handleNavClick('about_us')}>About Us</button></li>
          <li style={{ margin: '0 10px' }}><button onClick={() => handleNavClick('services')}>Services</button></li>
        </ul>
      </nav>
      
      {websiteContent && (
        <div>
          <style dangerouslySetInnerHTML={{ __html: websiteContent.css }} />
          <div dangerouslySetInnerHTML={{ __html: websiteContent.html }} />
        </div>
      )}
    </div>
  );
};

export default Page;
