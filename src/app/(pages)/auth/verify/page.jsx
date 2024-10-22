'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        toast.error('Invalid verification link');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.user._id);
          localStorage.setItem('userEmail', data.user.email);
          localStorage.setItem('username', data.user.username);
          toast.success('Email verified successfully');
          router.push('/dashboard'); // Redirect to dashboard or desired page
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error('Verification error:', error);
        toast.error('An error occurred during verification');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Toaster />
      {loading ? (
        <div className="text-center">
          <div className="loader"></div> {/* Add your loader component or animation here */}
          <p className="mt-4 text-lg font-semibold">Verifying your email...</p>
        </div>
      ) : (
        <p className="text-lg font-semibold">Verification complete. Redirecting...</p>
      )}
    </div>
  );
};

export default VerifyEmail;
