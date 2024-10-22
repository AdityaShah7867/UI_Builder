'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaHome, FaEnvelope, FaInfoCircle, FaCogs, FaEdit, FaEye, FaPlus, FaSignOutAlt, FaUser, FaBars, FaTimes, FaChartLine } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
  const [userEmail, setUserEmail] = useState('');
  const [username, setUsername] = useState('');
  const [contents, setContents] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const storedUsername = localStorage.getItem('username');
    setUserEmail(email || 'Not available');
    setUsername(storedUsername || 'User');

    const fetchData = async () => {
      try {
        const token = `${localStorage.getItem('token')}`;
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

  const sections = [
    { name: 'Dashboard', icon: <FaChartLine className="w-5 h-5" /> },
    { name: 'Home', icon: <FaHome className="w-5 h-5" /> },
    { name: 'Contact', icon: <FaEnvelope className="w-5 h-5" /> },
    { name: 'About Us', icon: <FaInfoCircle className="w-5 h-5" /> },
    { name: 'Services', icon: <FaCogs className="w-5 h-5" /> }
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.push('/auth/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
        <div className="flex items-center space-x-4 px-4">
          <div className="bg-gray-600 rounded-full p-2">
            <FaUser className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{username}</h2>
            <p className="text-gray-400 text-xs">{userEmail}</p>
          </div>
        </div>
        <nav>
          {sections.map((item) => (
            <Link key={item.name} href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
              <div className="flex items-center space-x-3">
                {item.icon}
                <span>{item.name}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* New Banner */}
        <div className="bg-blue-600 text-white text-center py-2 px-4">
          Get your live website at <a href={`http://localhost:3000/website?username=${username}&contentType=home`} className="underline hover:text-blue-200" target="_blank" rel="noopener noreferrer">http://localhost:3000/website?username={username}&contentType=home</a>
        </div>

        {/* Header */}
        <header className="bg-white shadow-md flex justify-between items-center py-4 px-6">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-500 focus:outline-none md:hidden">
              {isSidebarOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
            <h1 className="text-2xl font-semibold text-gray-800 ml-4">Dashboard</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Content Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.slice(1).map((section) => {
                const sectionContent = contents.filter(content => content.contentType.toLowerCase() === section.name.toLowerCase().replace(' ', '_'));
                return (
                  <div key={section.name} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center">
                        {section.icon}
                        <h3 className="ml-3 text-lg font-semibold">{section.name}</h3>
                      </div>
                      <span className="bg-blue-500 text-xs font-semibold px-2 py-1 rounded-full">
                        {sectionContent.length} items
                      </span>
                    </div>
                    <div className="p-6">
                      {sectionContent.length > 0 ? (
                        <div className="space-y-3">
                          {sectionContent.slice(0, 3).map(content => (
                            <div key={content._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                              <span className="text-sm text-gray-600 font-medium">{content.uuid}</span>
                              <div className="flex space-x-2">
                                <Link href={`/edit?uid=${content.uuid}&cssuid=${content.cssUuid}&pageref=${section.name.toLowerCase().replace(' ', '_')}`}>
                                  <button className="text-blue-500 hover:text-blue-700">
                                    <FaEdit className="w-4 h-4" />
                                  </button>
                                </Link>
                                <Link href={`/user/view?uid=${content.uuid}&cssuid=${content.cssUuid}&pageref=${section.name.toLowerCase().replace(' ', '_')}`}>
                                  <button className="text-green-500 hover:text-green-700">
                                    <FaEye className="w-4 h-4" />
                                  </button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center">No content available</p>
                      )}
                    </div>
                    <div className="bg-gray-50 px-6 py-3">
                      <Link href={`/builder?pageref=${section.name.toLowerCase().replace(' ', '_')}`}>
                        <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center">
                          <FaPlus className="mr-2" /> Add New Content
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
