export const saveToContentstack = async (html, userId, contentTypeUid) => {
  const payload = {
    entry: {
      title: `My UI Design ${userId}`,
      rte: html,
      user_id: userId, // Add user_id to the payload
    }
  };

  try {
    const response = await fetch(`https://eu-api.contentstack.com/v3/content_types/${contentTypeUid}/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key': 'bltd0d04fe9ed5696bc',
        'authorization': 'cs4b0ee821db9d29665d32a615',
        // 'environment': process.env.CONTENTSTACK_ENVIRONMENT,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Entry saved:', data);
    } else {
      console.error('Error saving entry:', response.statusText);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
};
