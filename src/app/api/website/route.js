import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import User from '@/app/models/user';
import Content from '@/app/models/content';

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const contentType = searchParams.get('contentType');

  if (!username || !contentType) {
    return NextResponse.json({ error: 'Username and contentType are required' }, { status: 400 });
  }

  try {
    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the content
    const content = await Content.findOne({ userId: user._id, contentType });
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Fetch HTML content from Contentstack
    const htmlResponse = await fetch(`https://eu-api.contentstack.com/v3/content_types/${contentType}/entries/${content.uuid}`, {
      headers: {
        'api_key': 'bltd0d04fe9ed5696bc',
        'authorization': 'cs4b0ee821db9d29665d32a615',
      }
    });
    const htmlData = await htmlResponse.json();

    // Fetch CSS content from Contentstack
    const cssResponse = await fetch(`https://eu-api.contentstack.com/v3/content_types/${contentType}_css/entries/${content.cssUuid}`, {
      headers: {
        'api_key': 'bltd0d04fe9ed5696bc',
        'authorization': 'cs4b0ee821db9d29665d32a615',
      }
    });
    const cssData = await cssResponse.json();

    // Return the HTML and CSS content
    return NextResponse.json({
      html: htmlData.entry.rte,
      css: cssData.entry.css
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

