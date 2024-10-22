'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const Page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user._id);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('username', data.user.username);
      router.push('/dashboard');
      toast.success("Login successful");
    } else {
      toast.error(data.message);
    }
    console.log(data);
  };

  return (
    <div className="min-h-screen flex">
      <Toaster />
      {/* Left side - Login form */}
      <div className="w-1/2 flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">UI Builder</h1>
            <h2 className="text-2xl font-semibold text-center text-gray-700">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md -space-y-px">
              <div className="mb-4">
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm pl-10"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm pl-10"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <FaSignInAlt className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
                </span>
                Sign in
              </button>
            </div>
          </form>
          <div className="text-center">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Forgot your password?
            </a>
          </div>
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a onClick={() => router.push('/auth/signup')} className="font-medium cursor-pointer text-blue-600 hover:text-blue-500">
              Sign up
            </a>
          </div>
        </div>
      </div>
      
      {/* Right side - Background image and app benefits */}
      <div className="w-1/2 bg-cover bg-center relative" style={{backgroundImage: "url('/path/to/your/image.jpg')"}}>
        <div className="absolute inset-0 bg-blue-600 opacity-75"></div>
        <div className="relative z-10 flex flex-col justify-center h-full px-8 text-white">
          <h2 className="text-3xl font-bold mb-6">Why Use UI Builder?</h2>
          <ul className="space-y-4">
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Intuitive drag-and-drop interface
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Responsive design templates
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Real-time collaboration
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Export to multiple formats
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Page
