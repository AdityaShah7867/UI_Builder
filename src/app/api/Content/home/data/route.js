import jwt from 'jsonwebtoken';
import dbConnect from '@/app/lib/mongodb';
import User from '@/app/models/user';
import Content from '@/app/models/content';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export async function POST(req) {
  await dbConnect();

  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return new Response(JSON.stringify({ success: false, message: 'No token, authorization denied' }), {
      status: 401,
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.userId; // Assuming this is the user ID
    console.log('user', req.user);
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Token is not valid', error: error.message }), { status: 401 });
  }

  try {
    const { uuid, cssUuid, contentType } = await req.json();

    if (!uuid) {
      return new Response(JSON.stringify({ success: false, message: 'UUID is required' }), {
        status: 400,
      });
    }

    if (!cssUuid) {
      return new Response(JSON.stringify({ success: false, message: 'cssUuid is required' }), {
        status: 400,
      });
    }

    // Log the received cssUuid for debugging
    console.log('Received cssUuid:', cssUuid);

    // Fetch the existing user by userId
    const user = await User.findOne({ _id: req.user });
    if (!user) {
      return new Response(JSON.stringify({ success: false, message: 'User not found' }), { status: 404 });
    }

    // Create a new content entry
    const content = await Content.create({
      uuid,
      contentType,
      cssUuid,
      userId: user._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Content created successfully',
      content: {
        uuid: content.uuid,
        cssUuid: content.cssUuid,
        contentType: content.contentType,
        createdAt: content.createdAt,
        updatedAt: content.updatedAt,
      }
    }), { status: 201 });

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ success: false, message: 'Internal server error', error: error.message }), { status: 500 });
  }
}

