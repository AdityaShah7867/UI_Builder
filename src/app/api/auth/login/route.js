import dbConnect from '@/app/lib/mongodb';
import User from '@/app/models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  const { email, password } = await req.json(); // Get the request body

  await dbConnect(); // Ensure the database is connected

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 400 });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Create a user object without the password
    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      // Add any other user fields you want to include
    };

    return new Response(JSON.stringify({ 
      token, 
      user: userWithoutPassword, 
      message: 'Login successful' 
    }), { status: 200 });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
}
