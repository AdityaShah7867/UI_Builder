'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const DashboardPage = () => {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    setUserEmail(email || 'Not available');
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
      
      <div className="mb-6">
        <p className="text-gray-600">Welcome, {userEmail}</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {['Home', 'Contact', 'About Us', 'Services'].map((item) => (
          <Link href={`/${item.toLowerCase().replace(' ', '-')}`} key={item}>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-medium">{item}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
