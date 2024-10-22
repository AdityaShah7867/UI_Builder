import dbConnect from '@/app/lib/mongodb';
import User from '@/app/models/user';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('token'); // Assuming the token is the user ID

  if (!userId) {
    return NextResponse.json({ message: 'Invalid verification link' }, { status: 400 });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.verified) {
      return NextResponse.json({ message: 'User already verified' }, { status: 400 });
    }

    user.verified = true;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Create a user object without the password
    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      username: user.username,
      // Add any other user fields you want to include
    };

    return NextResponse.json({ 
      token, 
      user: userWithoutPassword, 
      message: 'User verified successfully' 
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
