'use client';
import { useEffect, useRef, useState } from 'react';
import grapesjs from 'grapesjs';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import 'grapesjs/dist/css/grapes.min.css';
import { saveToContentstack } from '@/app/utils/contentstackHelper';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const Edit = () => {
  const editorRef = useRef(null);
  const [content, setContent] = useState('');
  const [css, setCss] = useState('');
  const [buttonText, setButtonText] = useState('Click Me');
  const [buttonColor, setButtonColor] = useState('#007bff');
  const [pageRef, setPageRef] = useState('');
  const [uid, setUid] = useState(''); // Declare uid state
  const [cssuid, setCssUid] = useState(''); // Declare cssuid state
  const router = useRouter();

  useEffect(() => {
    // Extract URL parameters
    const params = new URLSearchParams(window.location.search);
    const uidParam = params.get('uid');
    const cssuidParam = params.get('cssuid');
    const pageref = params.get('pageref');

    if (uidParam && cssuidParam && pageref) {
      setUid(uidParam); // Set uid state
      setCssUid(cssuidParam); // Set cssuid state
      setPageRef(pageref);

      const fetchContent = async (contentTypeUid, entryUid, setContent, contentKey) => {
        try {
          const response = await fetch(`https://eu-api.contentstack.com/v3/content_types/${contentTypeUid}/entries/${entryUid}`, {
            headers: {
              'api_key': 'bltd0d04fe9ed5696bc',
              'authorization': 'cs4b0ee821db9d29665d32a615',
            }
          });
          const data = await response.json();
          setContent(data.entry[contentKey]);
        } catch (error) {
          console.error('Error fetching content:', error);
        }
      };

      const editor = grapesjs.init({
        container: '#gjs',
        height: '100vh',
        width: '100%',
        storageManager: false,
        plugins: [gjsBlocksBasic],
        styleManager: {
          sectors: [
            {
              name: 'Typography',
              open: true,
              properties: [
                { 
                  name: 'Font Size', 
                  property: 'font-size', 
                  type: 'number',
                  units: ['px', 'em', 'rem', '%'],
                  min: 1,
                  max: 100,
                  step: 1
                },
                { name: 'Font Color', property: 'color', type: 'color' },
                { name: 'Background Color', property: 'background-color', type: 'color' },
                { name: 'Font Weight', property: 'font-weight', type: 'select', options: [
                    { value: 'normal', name: 'Normal' },
                    { value: 'bold', name: 'Bold' },
                    { value: 'bolder', name: 'Bolder' },
                    { value: 'lighter', name: 'Lighter' },
                  ]
                },
                { name: 'Text Shadow', property: 'text-shadow', type: 'text', placeholder: '0 0 5px #000' },
                { name: 'Text Align', property: 'text-align', type: 'select', options: [
                    { value: 'left', name: 'Left' },
                    { value: 'center', name: 'Center' },
                    { value: 'right', name: 'Right' },
                  ]
                },
                { name: 'Margin', property: 'margin', type: 'text', placeholder: '0 auto' },
                // New properties for images
                { name: 'Width', property: 'width', type: 'text', placeholder: '100%' },
                { name: 'Height', property: 'height', type: 'text', placeholder: 'auto' },
                { name: 'Border', property: 'border', type: 'text', placeholder: '1px solid #000' },
                { name: 'Border Radius', property: 'border-radius', type: 'text', placeholder: '5px' },
                { name: 'Box Shadow', property: 'box-shadow', type: 'text', placeholder: '0 4px 8px rgba(0,0,0,0.2)' },
              ],
            },
            // New sector for Image properties
            {
              name: 'Image',
              open: true,
              properties: [
                { name: 'Width', property: 'width', type: 'text', placeholder: '100%' },
                { name: 'Height', property: 'height', type: 'text', placeholder: 'auto' },
                { name: 'Border', property: 'border', type: 'text', placeholder: '1px solid #000' },
                { name: 'Border Radius', property: 'border-radius', type: 'text', placeholder: '5px' },
                { name: 'Box Shadow', property: 'box-shadow', type: 'text', placeholder: '0 4px 8px rgba(0,0,0,0.2)' },
                { name: 'Text Align', property: 'text-align', type: 'select', options: [
                    { value: 'left', name: 'Left' },
                    { value: 'center', name: 'Center' },
                    { value: 'right', name: 'Right' },
                  ]
                },
                { name: 'Margin', property: 'margin', type: 'text', placeholder: '0 auto' },
                // New property for image alignment
                { name: 'Image Align', property: 'image-align', type: 'select', options: [
                    { value: 'left', name: 'Left' },
                    { value: 'center', name: 'Center' },
                    { value: 'right', name: 'Right' },
                  ]
                },
                { 
                  name: 'Alignment', 
                  property: 'display', 
                  type: 'radio',
                  options: [
                    { value: 'inline', name: 'Inline' },
                    { value: 'block', name: 'Block' }
                  ]
                },
                { 
                  name: 'Center Image', 
                  property: 'margin', 
                  type: 'radio',
                  options: [
                    { value: '0', name: 'Left' },
                    { value: '0 auto', name: 'Center' },
                    { value: '0 0 0 auto', name: 'Right' }
                  ]
                },
              ],
            },
            {
              name: 'Box',
              open: true,
              properties: [
                { name: 'Border', property: 'border', type: 'text', placeholder: '1px solid #000' },
                { name: 'Border Radius', property: 'border-radius', type: 'text', placeholder: '5px' },
                { name: 'Box Shadow', property: 'box-shadow', type: 'text', placeholder: '0 4px 8px rgba(0,0,0,0.2)' },
              ],
            },
            {
              name: 'Layout',
              open: true,
              properties: [
                { 
                  name: 'Display', 
                  property: 'display', 
                  type: 'select',
                  options: [
                    { value: 'block', name: 'Block' },
                    { value: 'inline', name: 'Inline' },
                    { value: 'inline-block', name: 'Inline Block' },
                    { value: 'flex', name: 'Flex' },
                  ]
                },
                { 
                  name: 'Flex Direction', 
                  property: 'flex-direction', 
                  type: 'radio',
                  options: [
                    { value: 'row', name: 'Row' },
                    { value: 'column', name: 'Column' }
                  ]
                },
                { 
                  name: 'Justify Content', 
                  property: 'justify-content', 
                  type: 'select',
                  options: [
                    { value: 'flex-start', name: 'Start' },
                    { value: 'center', name: 'Center' },
                    { value: 'flex-end', name: 'End' },
                    { value: 'space-between', name: 'Space Between' },
                    { value: 'space-around', name: 'Space Around' }
                  ]
                },
                { 
                  name: 'Align Items', 
                  property: 'align-items', 
                  type: 'select',
                  options: [
                    { value: 'flex-start', name: 'Start' },
                    { value: 'center', name: 'Center' },
                    { value: 'flex-end', name: 'End' },
                    { value: 'stretch', name: 'Stretch' }
                  ]
                },
              ],
            },
          ],
        },
      });

      // Add custom button block with link
      editor.BlockManager.add('custom-button', {
        label: 'Custom Button',
        content: `<a href="#" class="dynamic-link" style="padding: 10px; background-color: ${buttonColor}; color: #fff; text-decoration: none; border: none; border-radius: 5px;">${buttonText}</a>`,
        category: 'Basic',
      });

      // Update the image alignment handling
      editor.on('component:update', (model) => {
        if (model.get('type') === 'image') {
          const imageAlign = model.getStyle()['image-align'];
          if (imageAlign) {
            let styles = { display: 'block' };
            switch (imageAlign) {
              case 'left':
                styles.marginRight = 'auto';
                break;
              case 'center':
                styles.marginLeft = 'auto';
                styles.marginRight = 'auto';
                break;
              case 'right':
                styles.marginLeft = 'auto';
                break;
            }
            model.setStyle(styles);
          }
        }
      });

      // Fetch HTML content and set it in the editor
      fetchContent(pageref, uidParam, (htmlContent) => {
        editor.setComponents(htmlContent);
      }, 'rte');

      // Fetch CSS content and set it in the editor
      const css = pageref + '_css';
      fetchContent(css, cssuidParam, (cssContent) => {
        editor.setStyle(cssContent);
      }, 'css');

      editorRef.current = editor;

      return () => {
        editor.destroy();
      };
    }
  }, []);

  const saveContent = () => {
    const htmlContent = editorRef.current.getHtml();
    const cssContent = editorRef.current.getCss();
    setContent(htmlContent);
    setCss(cssContent);
    console.log('HTML Content:', htmlContent);
    console.log('CSS Content:', cssContent);
    const contentTypeUid = pageRef || 'home';

    const updateContent = async (contentTypeUid, entryUid, contentKey, contentValue) => {
      try {
        const response = await fetch(`https://eu-api.contentstack.com/v3/content_types/${contentTypeUid}/entries/${entryUid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'api_key': 'bltd0d04fe9ed5696bc',
            'authorization': 'cs4b0ee821db9d29665d32a615',
          },
          body: JSON.stringify({
            entry: {
              [contentKey]: contentValue,
            },
          }),
        });

        if (response.ok) {
          console.log(`Content for ${contentKey} updated successfully.`);
          toast.success(`Content updated successfully.`);
        } else {
          const errorData = await response.json();
          console.error(`Error updating ${contentKey} content:`, errorData);
          toast.error(`Error updating ${contentKey} content.`);
        }
      } catch (error) {
        console.error(`Error updating ${contentKey} content:`, error);
        toast.error(`Error updating ${contentKey} content.`);
      }
    };

    // Update HTML content
    updateContent(contentTypeUid, uid, 'rte', htmlContent);

    // Update CSS content
    const cssContentTypeUid = `${contentTypeUid}_css`;
    updateContent(cssContentTypeUid, cssuid, 'css', cssContent);
    toast.success(`Content updated successfully.`);
    router.push('/dashboard');
  };

  const setButtonLink = (editor) => {
    const selected = editor.getSelected();
    if (selected && selected.is('link')) {
      const url = prompt('Enter the URL for the button:', 'https://example.com');
      if (url) {
        try {
          new URL(url); // Validate URL
          selected.set('attributes', { href: url, target: '_blank' });
        } catch {
          alert('Please enter a valid URL.');
        }
      }
    } else {
      alert('Please select a button first.');
    }
  };

  return (
    <div>
      <Toaster />
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f4f4f4' }}>
      <header style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', textAlign: 'center' }}>
        <h1 style={{ margin: 0 }}>UI Builder</h1>
      </header>
     
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <button 
          onClick={saveContent} 
          className="btn btn-success bg-green-500 text-white"
        >
          Save Content
        </button>
        <button 
          onClick={() => setButtonLink(editorRef.current)} 
          className="btn btn-primary bg-blue-500 text-white"
        >
          Set Button Link
        </button>
        <div id="gjs" style={{ flex: 1, border: '1px solid #ccc', backgroundColor: '#fff' }}></div>
      </div>
    </div>
    </div>
  );
};

export default Edit;
