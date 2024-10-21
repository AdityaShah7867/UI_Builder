'use client'
import React, { useEffect, useState } from 'react'

const page = () => {
  const [htmlContent, setHtmlContent] = useState('');
  const [cssContent, setCssContent] = useState('');

  // Extract URL parameters
  const searchParams = new URLSearchParams(window.location.search);
  const uid = searchParams.get('uid');
  const cssuid = searchParams.get('cssuid');
  const pageref = searchParams.get('pageref');
  useEffect(() => {
    const fetchContent = async (contentTypeUid, entryUid, setContent, contentKey) => {
      try {
        const response = await fetch(`https://eu-api.contentstack.com/v3/content_types/${contentTypeUid}/entries/${entryUid}`, {
          headers: {
            'api_key': 'bltd0d04fe9ed5696bc',
            'authorization': 'cs4b0ee821db9d29665d32a615',
          }
        });
        const data = await response.json();
        setContent(data.entry[contentKey]); // Use the correct key to extract content
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };
const css = pageref + '_css'
    // Fetch HTML content
    fetchContent(pageref, uid, setHtmlContent, 'rte');

    // Fetch CSS content
    fetchContent(css, cssuid, setCssContent, 'css');
  }, [uid, cssuid]);

  return (
    <div>
      {/* <h1>User Information</h1>
      <p>UID: {uid}</p>
      <p>CSSUID: {cssuid}</p> */}
      <style>{cssContent}</style>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  )
}

export default page




