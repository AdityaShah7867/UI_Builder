import jwt from 'jsonwebtoken';
import dbConnect from '@/app/lib/mongodb';
import Content from '@/app/models/content';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export async function GET(req) {
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
    const userId = decoded.userId; // Assuming this is the user ID
    console.log('User ID:', userId);

    // Fetch all content associated with the user
    const contents = await Content.find({ userId: userId }).sort({ createdAt: -1 }); // Sort by createdAt if desired

    return new Response(JSON.stringify({
      success: true,
      contents: contents,
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Token is not valid', error: error.message }), { status: 401 });
  }
}
