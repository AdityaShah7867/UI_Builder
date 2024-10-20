import jwt from 'jsonwebtoken';
import dbConnect from '../../lib/mongodb';
import User from '@/app/models/user';
import Content from '@/app/models/content';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await dbConnect();

  try {
    // Extract JWT token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Extract content type from headers
    const contentType = req.headers['content-type'];

    // Extract UUID and data from request body
    const { uuid, data } = req.body;

    if (!uuid) {
      return res.status(400).json({ message: 'UUID is required' });
    }

    // Find or create user
    let user = await User.findOne({ userId: decoded.userId });
    if (!user) {
      user = new User({ userId: decoded.userId, email: decoded.email });
      await user.save();
    }

    // Create or update content
    const content = await Content.findOneAndUpdate(
      { uuid },
      { 
        contentType, 
        data, 
        createdBy: user._id,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: 'Content processed and saved successfully',
      content: {
        uuid: content.uuid,
        contentType: content.contentType,
        createdAt: content.createdAt,
        updatedAt: content.updatedAt
      }
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}