'use client'
import { useEffect } from 'react';
import grapesjs from 'grapesjs';

const Builder = () => {
  useEffect(() => {
    // Initialize GrapesJS
    const editor = grapesjs.init({
      container: '#gjs',
      fromElement: true,
      height: '100vh',
      width: 'auto',
      storageManager: {
        type: 'local', // Change this if you want to use a different storage type
      },
      plugins: ['gjs-blocks-basic'], // Add any additional plugins you want to use
      pluginsOpts: {
        'gjs-blocks-basic': {},
      },
    });

    // Optional: Add commands for saving
    editor.Commands.add('save-design', {
      run: (editor) => {
        const html = editor.getHtml();
        const css = editor.getCss();
        console.log('HTML:', html);
        console.log('CSS:', css);
        // Call your save function here
      },
    });

  }, []);

  return (
    <div className='bg-white text-black'>
      <h1 className="text-center text-2xl font-bold mb-4">UI Builder</h1>
      <div id="gjs" className="border border-gray-300" />
      <button 
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        onClick={() => editor.runCommand('save-design')}
      >
        Save Design
      </button>
    </div>
  );
};

export default Builder;
