export const saveToContentstack = async (html, css, userId, contentTypeUid) => {
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

      // Save CSS in a different content type
      const cssPayload = {
        entry: {
          title: `My UI Design CSS ${userId}`,
          css: css,
          user_id: userId,
        }
      };

      const cssResponse = await fetch(`https://eu-api.contentstack.com/v3/content_types/${contentTypeUid}_css/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api_key': 'bltd0d04fe9ed5696bc',
          'authorization': 'cs4b0ee821db9d29665d32a615',
        },
        body: JSON.stringify(cssPayload),
      });

      if (cssResponse.ok) {
        const cssData = await cssResponse.json();
        console.log('CSS Entry saved:', cssData);

        // Call function to save data to MongoDB with both content and CSS UIDs
        await saveToMongoDB(data.entry, cssData.entry, contentTypeUid);
      } else {
        console.error('Error saving CSS entry:', cssResponse.statusText);
      }
    } else {
      console.error('Error saving entry:', response.statusText);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

// Function to save data to MongoDB
const saveToMongoDB = async (entry, cssEntry, contentTypeUid) => {
  try {
    const response = await fetch('/api/Content/home/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        uuid: entry.uid, // Ensure uuid is included
        cssUuid: cssEntry.uid, // Include CSS uuid
        contentType: contentTypeUid // Ensure contentType is included
      }),
    });

    if (response.ok) {
      console.log('Entry saved to MongoDB');
    } else {
      console.error('Error saving to MongoDB:', response.statusText);
    }
  } catch (error) {
    console.error('MongoDB save error:', error);
  }
};
