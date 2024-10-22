'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';





export default function RootLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  return (
    <html lang="en">
      <body
        className={`antialiased bg-white text-black`}
      >
        {children}
      </body>
    </html>
  );
}
