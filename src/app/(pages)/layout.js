'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export default function RootLayout({ children }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    setMessages(prev => [...prev, { type: 'user', content: question }]);
    setQuestion('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      
      // Add the bot's response to the messages
      setMessages(prev => [...prev, { type: 'bot', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { type: 'bot', content: 'Sorry, there was an error processing your question.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <html lang="en">
      <body className={`antialiased bg-white text-black`}>
        {children}
        <div className={`fixed bottom-4 right-4 ${isOpen ? 'w-80' : 'w-16'} transition-all duration-300 ease-in-out`}>
          {!isOpen && (
            <div 
              className="bg-blue-500 text-white p-4 rounded-full cursor-pointer w-16 h-16 flex items-center justify-center"
              onClick={() => setIsOpen(true)}
            >
              💬
            </div>
          )}
          {isOpen && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
                <span>AI Assistant</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200 focus:outline-none"
                >
                  ✕
                </button>
              </div>
              <div className="h-96 overflow-y-auto p-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`mb-2 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block p-2 rounded-lg ${msg.type === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {msg.type === 'user' ? (
                        msg.content
                      ) : (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      )}
                    </span>
                  </div>
                ))}
                {isLoading && <div className="text-center">Thinking...</div>}
              </div>
              <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask about the website..."
                    className="flex-grow p-2 border rounded"
                  />
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded" disabled={isLoading}>
                    Send
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
