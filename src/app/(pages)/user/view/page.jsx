'use client'
import React, { useEffect, useState } from 'react'

const page = () => {
  const [htmlContent, setHtmlContent] = useState('');
  const [cssContent, setCssContent] = useState('');

  // Extract URL parameters
  const searchParams = new URLSearchParams(window.location.search);
  const uid = searchParams.get('uid');
  const cssuid = searchParams.get('cssuid');

  useEffect(() => {
    const fetchContent = async (contentTypeUid, entryUid, setContent) => {
      try {
        const response = await fetch(`https://{{base_url}}/v3/content_types/${contentTypeUid}/entries/${entryUid}`, {
          headers: {
            'api_key': 'your_api_key_here',
            'authorization': 'your_management_token_here'
          }
        });
        const data = await response.json();
        setContent(data.content); // Adjust this based on the actual structure of your API response
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    // Fetch HTML content
    fetchContent('html_content_type_uid', uid, setHtmlContent);

    // Fetch CSS content
    fetchContent('css_content_type_uid', cssuid, setCssContent);
  }, [uid, cssuid]);

  return (
    <div>
      <h1>User Information</h1>
      <p>UID: {uid}</p>
      <p>CSSUID: {cssuid}</p>
      <style>{cssContent}</style>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  )
}

export default page




