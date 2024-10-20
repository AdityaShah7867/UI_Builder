'use client'
import React, { useEffect } from 'react'
import grapesjs from 'grapesjs'

const page = () => {
  useEffect(() => {
    const editor = grapesjs.init({
      container: '#gjs',
      fromElement: true,
      height: '100vh',
      width: 'auto',
      storageManager: { autoload: 0 },
      panels: { defaults: [] },
      plugins: ['gjs-blocks-basic'],
      // Add responsive breakpoints
      deviceManager: {
        devices: [
          { name: 'Desktop', width: '1200px' },
          { name: 'Tablet', width: '768px' },
          { name: 'Mobile', width: '320px' },
        ],
      },
      // Add default components and styles
      components: '<h1>Hello World</h1>',
      style: '.my-class { color: red; }',
    });

    // Optional: Add a listener to check if the editor is ready
    editor.on('load', () => {
      console.log('GrapesJS editor loaded');
    });
  }, []);

  return (
    <div id="gjs" style={{ height: '100vh', border: '1px solid #ccc' }}>
      {/* GrapesJS editor will be rendered here */}
    </div>
  )
}

export default page
