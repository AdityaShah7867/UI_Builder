'use client';
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-gray-800">EZ Builder</div>
            <div>
              {/* <a href="#" className="text-gray-600 hover:text-gray-800 px-3 py-2">Features</a>
              <a href="#" className="text-gray-600 hover:text-gray-800 px-3 py-2">Pricing</a> */}
              <a onClick={() => router.push('/auth/login')} className="bg-blue-500 text-white px-4 py-2 rounded-md ml-4 cursor-pointer">Get Started</a>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <section className="container mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row gap-24 items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Build Your Landing Page with Ease
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Create stunning landing pages in minutes with our drag-and-drop, no-code platform. Powered by Contentstack for seamless content management.
              </p>
              <a onClick={() => router.push('/auth/login')} className="bg-blue-500 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-600 transition duration-300">
                Start Building Now
              </a>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://adityadevappweb.s3.ap-south-1.amazonaws.com/DALL%C2%B7E+2024-10-22+01.13.41+-+A+clean+and+modern+UI+builder+website+landing+page+concept.+The+image+features+a+user-friendly+interface+with+a+drag-and-drop+canvas+at+the+center%2C+su.webp"
                alt="EZ Builder Interface"
               
                className="rounded-lg shadow-md w-[500px]"
              />
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🖱️</div>
                <h3 className="text-xl font-semibold mb-2">Drag and Drop</h3>
                <p className="text-gray-600">Easily build your page with our intuitive drag-and-drop interface.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-semibold mb-2">Responsive Design</h3>
                <p className="text-gray-600">Create pages that look great on any device, automatically.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4 flex justify-center items-center  ">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4DpQqDEq9uPtEPS1ZiRIqoouAJ26VPniPcA&s" className="w-10 h-10" alt="Contentstack" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Contentstack Integration</h3>
                <p className="text-gray-600">Seamlessly manage your content with Contentstack CMS integration.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2023 EZ Builder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
