'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const DashboardPage = () => {
  const [userEmail, setUserEmail] = useState('');
  const [contents, setContents] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    setUserEmail(email || 'Not available');

    const fetchData = async () => {
      try {
        const token =  `${localStorage.getItem('token')}` // Replace with actual token retrieval logic
        const response = await fetch('/api/dash/get', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (data.success) {
          setContents(data.contents);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const sections = ['Home', 'Contact', 'About Us', 'Services'];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
      
      <div className="mb-6">
        <p className="text-gray-600">Welcome, {userEmail}</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {sections.map((section) => {
          const sectionContent = contents.filter(content => content.contentType.toLowerCase() === section.toLowerCase().replace(' ', '_'));
          return (
            <div key={section} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-medium">{section}</h2>
              {sectionContent.length > 0 ? (
                <div className="mt-4">
                  {sectionContent.map(content => (
                    <div key={content._id} className="flex justify-between items-center">
                      <div className="text-gray-500">{content.uuid}</div>
                      <div className="text-gray-500">{content.cssUuid}</div>

                      <div>
                        <Link href={`/builder/edit?${section.toLowerCase().replace(' ', '-')}`}>
                          <button className="text-blue-500 hover:underline">Edit</button>
                        </Link>
                        <Link href={`/user/view?uid=${content.uuid}&cssuid=${content.cssUuid}&pageref=${section.toLowerCase().replace(' ', '_')}`}>
                          <button className="ml-2 text-blue-500 hover:underline">View</button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Link href={`/builder?pageref=${section.toLowerCase().replace(' ', '_')}`}>
                  <button className="mt-4 text-green-500 hover:underline">Create</button>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
