'use client';
import { useEffect, useRef, useState } from 'react';
import grapesjs from 'grapesjs';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import 'grapesjs/dist/css/grapes.min.css';
import { saveToContentstack } from '@/app/utils/contentstackHelper';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Builder = () => {
  const editorRef = useRef(null);
  const [content, setContent] = useState('');
  const [css, setCss] = useState('');
  const [buttonText, setButtonText] = useState('Click Me');
  const [buttonColor, setButtonColor] = useState('#007bff');
  const [pageRef, setPageRef] = useState(''); // New state for pageref
const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customHtml, setCustomHtml] = useState('');
  const [customCss, setCustomCss] = useState('');

  useEffect(() => {
    // Extract pageref from URL
    const params = new URLSearchParams(window.location.search);
    const pageref = params.get('pageref');
    if (pageref) {
      setPageRef(pageref);
      console.log('Page Reference:', pageref); // Log or use the pageref as needed
    }

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
      // Add this to your GrapesJS init configuration
      assetManager: {
        upload: 'https://your-upload-endpoint.com',
        uploadName: 'files',
        multiUpload: true,
        assets: [
          // Your default assets
        ],
        uploadFile: (e) => {
          const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
          // ... handle file upload ...
        },
      },
    });

    editorRef.current = editor;

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

    // Add new 3-card layout block with preview
    editor.BlockManager.add('three-card-layout', {
      label: '3 Cards with Image',
      content: `
        <div style="display: flex; justify-content: space-between; padding: 20px;">
          <div style="width: 30%; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <img src="https://via.placeholder.com/300x200" style="width: 100%; height: 200px; object-fit: cover;">
            <div style="padding: 15px;">
              <h3 style="font-size: 18px; margin-bottom: 10px;">Card 1 Title</h3>
              <p style="font-size: 14px;">Some content for card 1. Replace this with your own text.</p>
            </div>
          </div>
          <div style="width: 30%; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <img src="https://via.placeholder.com/300x200" style="width: 100%; height: 200px; object-fit: cover;">
            <div style="padding: 15px;">
              <h3 style="font-size: 18px; margin-bottom: 10px;">Card 2 Title</h3>
              <p style="font-size: 14px;">Some content for card 2. Replace this with your own text.</p>
            </div>
          </div>
          <div style="width: 30%; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <img src="https://via.placeholder.com/300x200" style="width: 100%; height: 200px; object-fit: cover;">
            <div style="padding: 15px;">
              <h3 style="font-size: 18px; margin-bottom: 10px;">Card 3 Title</h3>
              <p style="font-size: 14px;">Some content for card 3. Replace this with your own text.</p>
            </div>
          </div>
        </div>
      `,
      category: 'Basic',
      media: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="3" width="6" height="18" rx="1" fill="#ccc"/>
        <rect x="9" y="3" width="6" height="18" rx="1" fill="#ccc"/>
        <rect x="17" y="3" width="6" height="18" rx="1" fill="#ccc"/>
      </svg>`,
    });

    // Enhanced prebuilt pages
    editor.BlockManager.add('prebuilt-landing', {
      label: 'Landing Page',
      category: 'Prebuilt Pages',
      content: `
        <main>
          <section style="background-color: #e9ecef; padding: 80px 0; text-align: center;">
            <h2 style="font-size: 48px; color: #333; margin-bottom: 20px; font-weight: 700;">Welcome to Your Company</h2>
            <p style="font-size: 20px; color: #666; max-width: 600px; margin: 0 auto 30px;">We provide innovative solutions for your business needs. Discover how we can help you grow.</p>
            <a href="#" style="display: inline-block; background-color: #007bff; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: 600; transition: background-color 0.3s;">Learn More</a>
          </section>
          <section style="padding: 80px 0; background-color: #fff;">
            <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between;">
              <div style="flex: 1; padding: 0 20px; text-align: center;">
                <img src="https://via.placeholder.com/150" style="width: 80px; height: 80px; margin-bottom: 20px;">
                <h3 style="font-size: 24px; color: #333; margin-bottom: 15px;">Feature 1</h3>
                <p style="color: #666;">Description of feature 1 goes here. Highlight the benefits for your customers.</p>
              </div>
              <div style="flex: 1; padding: 0 20px; text-align: center;">
                <img src="https://via.placeholder.com/150" style="width: 80px; height: 80px; margin-bottom: 20px;">
                <h3 style="font-size: 24px; color: #333; margin-bottom: 15px;">Feature 2</h3>
                <p style="color: #666;">Description of feature 2 goes here. Explain how it solves a problem for users.</p>
              </div>
              <div style="flex: 1; padding: 0 20px; text-align: center;">
                <img src="https://via.placeholder.com/150" style="width: 80px; height: 80px; margin-bottom: 20px;">
                <h3 style="font-size: 24px; color: #333; margin-bottom: 15px;">Feature 3</h3>
                <p style="color: #666;">Description of feature 3 goes here. Emphasize its unique selling points.</p>
              </div>
            </div>
          </section>
          <section style="background-color: #f8f9fa; padding: 80px 0; text-align: center;">
            <h2 style="font-size: 36px; color: #333; margin-bottom: 40px;">What Our Clients Say</h2>
            <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between;">
              <div style="flex: 1; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 0 15px;">
                <p style="color: #666; font-style: italic;">"Your Company has transformed our business. Their innovative solutions have helped us increase productivity and reduce costs."</p>
                <p style="color: #333; font-weight: 600; margin-top: 20px;">- John Doe, CEO of Client Co.</p>
              </div>
              <div style="flex: 1; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 0 15px;">
                <p style="color: #666; font-style: italic;">"We've seen remarkable growth since partnering with Your Company. Their team is responsive, knowledgeable, and always goes the extra mile."</p>
                <p style="color: #333; font-weight: 600; margin-top: 20px;">- Jane Smith, CTO of Tech Inc.</p>
              </div>
            </div>
          </section>
        </main>
        <footer style="background-color: #343a40; color: #fff; padding: 40px 0;">
          <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between;">
            <div style="flex: 1;">
              <h3 style="font-size: 18px; margin-bottom: 20px;">Your Company</h3>
              <p style="font-size: 14px;">Providing innovative solutions since 2023.</p>
            </div>
            <div style="flex: 1;">
              <h3 style="font-size: 18px; margin-bottom: 20px;">Quick Links</h3>
              <ul style="list-style-type: none; padding: 0;">
                <li><a href="#" style="color: #fff; text-decoration: none; font-size: 14px;">Home</a></li>
                <li><a href="#" style="color: #fff; text-decoration: none; font-size: 14px;">About</a></li>
                <li><a href="#" style="color: #fff; text-decoration: none; font-size: 14px;">Services</a></li>
                <li><a href="#" style="color: #fff; text-decoration: none; font-size: 14px;">Contact</a></li>
              </ul>
            </div>
            <div style="flex: 1;">
              <h3 style="font-size: 18px; margin-bottom: 20px;">Contact Us</h3>
              <p style="font-size: 14px;">123 Main St, City, Country</p>
              <p style="font-size: 14px;">Phone: (123) 456-7890</p>
              <p style="font-size: 14px;">Email: info@yourcompany.com</p>
            </div>
          </div>
          <div style="text-align: center; margin-top: 40px; font-size: 14px;">
            <p>&copy; 2023 Your Company. All rights reserved.</p>
          </div>
        </footer>
      `,
      media: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" fill="#f8f9fa"/>
        <rect y="2" width="24" height="4" fill="#343a40"/>
        <rect y="18" width="24" height="4" fill="#343a40"/>
        <rect x="2" y="8" width="6" height="8" rx="1" fill="#ccc"/>
        <rect x="10" y="8" width="6" height="8" rx="1" fill="#ccc"/>
        <rect x="18" y="8" width="6" height="8" rx="1" fill="#ccc"/>
      </svg>`,
    });

    editor.BlockManager.add('prebuilt-about', {
      label: 'About Us Page',
      category: 'Prebuilt Pages',
      content: `
        <main>
          <section style="background-color: #e9ecef; padding: 60px 0; text-align: center;">
            <h2 style="font-size: 36px; color: #333; margin-bottom: 20px;">About Us</h2>
            <p style="font-size: 18px; color: #666; max-width: 800px; margin: 0 auto;">We are a dedicated team of professionals committed to delivering excellence in everything we do.</p>
          </section>
          <section style="padding: 60px 0;">
            <div style="max-width: 1200px; margin: 0 auto;">
              <h3 style="font-size: 24px; color: #333; margin-bottom: 20px;">Our Story</h3>
              <p style="color: #666; margin-bottom: 20px;">Founded in [year], Your Company has been at the forefront of innovation in [your industry]. Our journey began with a simple idea: [your founding principle or mission].</p>
              <h3 style="font-size: 24px; color: #333; margin-bottom: 20px;">Our Mission</h3>
              <p style="color: #666; margin-bottom: 20px;">At Your Company, our mission is to [your mission statement]. We strive to [your goals or objectives].</p>
              <h3 style="font-size: 24px; color: #333; margin-bottom: 20px;">Our Team</h3>
              <p style="color: #666;">Our diverse team of experts brings a wealth of experience and knowledge to every project. We're united by our passion for [your field] and our commitment to client success.</p>
            </div>
          </section>
        </main>
        <footer style="background-color: #343a40; color: #fff; padding: 20px 0; text-align: center;">
          <p>&copy; 2023 Your Company. All rights reserved.</p>
        </footer>
      `,
      media: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" fill="#f8f9fa"/>
        <rect y="2" width="24" height="4" fill="#343a40"/>
        <rect y="18" width="24" height="4" fill="#343a40"/>
        <circle cx="12" cy="9" r="3" fill="#e9ecef"/>
        <rect x="4" y="13" width="16" height="3" fill="#e9ecef"/>
      </svg>`,
    });

    editor.BlockManager.add('prebuilt-services', {
      label: 'Services Page',
      category: 'Prebuilt Pages',
      content: `
        <main>
          <section style="background-color: #e9ecef; padding: 60px 0; text-align: center;">
            <h2 style="font-size: 36px; color: #333; margin-bottom: 20px;">Our Services</h2>
            <p style="font-size: 18px; color: #666; max-width: 800px; margin: 0 auto;">Discover the range of professional services we offer to meet your needs.</p>
          </section>
          <section style="padding: 60px 0;">
            <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between;">
              <div style="width: 30%; margin-bottom: 30px;">
                <h3 style="font-size: 24px; color: #333; margin-bottom: 15px;">Service 1</h3>
                <p style="color: #666;">Description of service 1 goes here. Explain the benefits and features of this service.</p>
              </div>
              <div style="width: 30%; margin-bottom: 30px;">
                <h3 style="font-size: 24px; color: #333; margin-bottom: 15px;">Service 2</h3>
                <p style="color: #666;">Description of service 2 goes here. Explain the benefits and features of this service.</p>
              </div>
              <div style="width: 30%; margin-bottom: 30px;">
                <h3 style="font-size: 24px; color: #333; margin-bottom: 15px;">Service 3</h3>
                <p style="color: #666;">Description of service 3 goes here. Explain the benefits and features of this service.</p>
              </div>
              <div style="width: 30%; margin-bottom: 30px;">
                <h3 style="font-size: 24px; color: #333; margin-bottom: 15px;">Service 4</h3>
                <p style="color: #666;">Description of service 4 goes here. Explain the benefits and features of this service.</p>
              </div>
              <div style="width: 30%; margin-bottom: 30px;">
                <h3 style="font-size: 24px; color: #333; margin-bottom: 15px;">Service 5</h3>
                <p style="color: #666;">Description of service 5 goes here. Explain the benefits and features of this service.</p>
              </div>
              <div style="width: 30%; margin-bottom: 30px;">
                <h3 style="font-size: 24px; color: #333; margin-bottom: 15px;">Service 6</h3>
                <p style="color: #666;">Description of service 6 goes here. Explain the benefits and features of this service.</p>
              </div>
            </div>
          </section>
        </main>
        <footer style="background-color: #343a40; color: #fff; padding: 20px 0; text-align: center;">
          <p>&copy; 2023 Your Company. All rights reserved.</p>
        </footer>
      `,
      media: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" fill="#f8f9fa"/>
        <rect y="2" width="24" height="4" fill="#343a40"/>
        <rect y="18" width="24" height="4" fill="#343a40"/>
        <rect x="2" y="8" width="6" height="8" fill="#e9ecef"/>
        <rect x="10" y="8" width="6" height="8" fill="#e9ecef"/>
        <rect x="18" y="8" width="6" height="8" fill="#e9ecef"/>
      </svg>`,
    });

    editor.BlockManager.add('prebuilt-contact', {
      label: 'Contact Page',
      category: 'Prebuilt Pages',
      content: `
        <main>
          <section style="background-color: #e9ecef; padding: 60px 0; text-align: center;">
            <h2 style="font-size: 36px; color: #333; margin-bottom: 20px;">Contact Us</h2>
            <p style="font-size: 18px; color: #666; max-width: 800px; margin: 0 auto;">We'd love to hear from you. Get in touch with us for any inquiries or support.</p>
          </section>
          <section style="padding: 60px 0;">
            <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between;">
              <div style="width: 48%;">
                <h3 style="font-size: 24px; color: #333; margin-bottom: 20px;">Contact Information</h3>
                <p style="color: #666; margin-bottom: 10px;"><strong>Address:</strong> 123 Main St, City, Country</p>
                <p style="color: #666; margin-bottom: 10px;"><strong>Phone:</strong> +1 (123) 456-7890</p>
                <p style="color: #666; margin-bottom: 10px;"><strong>Email:</strong> info@yourcompany.com</p>
                <p style="color: #666; margin-bottom: 10px;"><strong>Hours:</strong> Monday - Friday, 9am - 5pm</p>
              </div>
              <div style="width: 48%;">
                <h3 style="font-size: 24px; color: #333; margin-bottom: 20px;">Send us a Message</h3>
                <form>
                  <div style="margin-bottom: 15px;">
                    <label for="name" style="display: block; margin-bottom: 5px; color: #333;">Name:</label>
                    <input type="text" id="name" name="name" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                  </div>
                  <div style="margin-bottom: 15px;">
                    <label for="email" style="display: block; margin-bottom: 5px; color: #333;">Email:</label>
                    <input type="email" id="email" name="email" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                  </div>
                  <div style="margin-bottom: 15px;">
                    <label for="message" style="display: block; margin-bottom: 5px; color: #333;">Message:</label>
                    <textarea id="message" name="message" rows="4" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
                  </div>
                  <button type="submit" style="background-color: #007bff; color: #fff; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">Send Message</button>
                </form>
              </div>
            </div>
          </section>
        </main>
        <footer style="background-color: #343a40; color: #fff; padding: 20px 0; text-align: center;">
          <p>&copy; 2023 Your Company. All rights reserved.</p>
        </footer>
      `,
      media: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" fill="#f8f9fa"/>
        <rect y="2" width="24" height="4" fill="#343a40"/>
        <rect y="18" width="24" height="4" fill="#343a40"/>
        <rect x="2" y="8" width="10" height="8" fill="#e9ecef"/>
        <rect x="14" y="8" width="8" height="8" fill="#e9ecef"/>
      </svg>`,
    });

    // Add this to your existing useEffect hook
    editor.Panels.addButton('options', {
      id: 'device-desktop',
      label: 'Desktop',
      command: 'set-device-desktop',
      active: true,
    });

    editor.Panels.addButton('options', {
      id: 'device-tablet',
      label: 'Tablet',
      command: 'set-device-tablet',
    });

    // editor.Panels.addButton('options', {
    //   id: 'device-mobile',
    //   label: 'Mobile',
    //   command: 'set-device-mobile',
    // });

    editor.Commands.add('set-device-desktop', {
      run: editor => editor.setDevice('Desktop')
    });

    editor.Commands.add('set-device-tablet', {
      run: editor => editor.setDevice('Tablet')
    });

    editor.Commands.add('set-device-mobile', {
      run: editor => editor.setDevice('Mobile')
    });

    // Add this to your existing useEffect hook
   
 
    // Add this to your existing useEffect hook
    editor.Panels.addButton('options', {
      id: 'open-code',
      className: 'fa fa-code',
      command: 'open-code',
      attributes: { title: 'Open Code' },
    });

    editor.Commands.add('open-code', {
      run: editor => {
        const viewer = editor.CodeManager.getViewer('CodeMirror');
        if (viewer) {
          viewer.setContent(editor.getHtml());
          viewer.open();
        } else {
          console.error('CodeMirror viewer not found');
        }
      }
    });

    // Add this to your existing useEffect hook
    editor.Panels.addButton('options', {
      id: 'undo',
      className: 'fa fa-undo',
      command: 'undo',
      attributes: { title: 'Undo' },
    });

    editor.Panels.addButton('options', {
      id: 'redo',
      className: 'fa fa-repeat',
      command: 'redo',
      attributes: { title: 'Redo' },
    });

   

    // Add these functions to your component
    const saveTemplate = () => {
      const template = editor.getProjectData();
      // Save template to your backend or local storage
    };

    const loadTemplate = (templateData) => {
      editor.loadProjectData(templateData);
    };

    // Add buttons to the editor panel
    editor.Panels.addButton('options', {
      id: 'save-template',
      className: 'fa fa-save',
      command: 'save-template',
      attributes: { title: 'Save Template' },
    });

    editor.Commands.add('save-template', {
      run: saveTemplate
    });

    // Add this to your existing useEffect hook
    

    // Add these functions to your component
    const exportHTML = () => {
      const html = editor.getHtml();
      const css = editor.getCss();
      const fullHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <style>${css}</style>
        </head>
        <body>${html}</body>
        </html>
      `;
      // Create a Blob and download it
      const blob = new Blob([fullHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'exported-page.html';
      a.click();
    };

    // Add button to the editor panel
    editor.Panels.addButton('options', {
      id: 'export-html',
      className: 'fa fa-download',
      command: 'export-html',
      attributes: { title: 'Export HTML' },
    });

    editor.Commands.add('export-html', {
      run: exportHTML
    });

    // Add this after your GrapesJS initialization
    // editor.on('load', () => {
    //   const fontManager = editor.FontManager;
      
    //   // Add Google Fonts
    //   fontManager.add('Google Fonts', [
    //     { name: 'Open Sans', value: '"Open Sans", sans-serif' },
    //     { name: 'Roboto', value: 'Roboto, sans-serif' },
    //     { name: 'Lato', value: 'Lato, sans-serif' },
    //     // Add more Google Fonts as needed
    //   ]);
    // });

    // Add AI Prompt button
    editor.Panels.addButton('options', {
      id: 'ai-prompt',
      className: 'fa fa-magic',
      command: 'open-ai-prompt',
      attributes: { title: 'AI Prompt' },
    });

    editor.Commands.add('open-ai-prompt', {
      run: () => setIsModalOpen(true)
    });

    // Add button to open custom HTML/CSS modal
    editor.Panels.addButton('options', {
      id: 'custom-html-css',
      className: 'fa fa-pencil',
      command: 'open-custom-html-css',
      attributes: { title: 'Custom HTML/CSS' },
    });

    editor.Commands.add('open-custom-html-css', {
      run: () => setIsCustomModalOpen(true)
    });

    // editorRef.current = editor;

    return () => {
      editor.destroy();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAiPrompt = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/generate-component', { prompt: aiPrompt });
      let generatedHtml = response.data.html;
      
      // Remove markdown formatting and backticks
      generatedHtml = generatedHtml.replace(/```html\n|\n```/g, '').trim();
      
      if (editorRef.current) {
        // Create a new component based on the AI response
        editorRef.current.addComponents(generatedHtml);
        
        setIsModalOpen(false);
        setAiPrompt('');
        toast.success('Component generated successfully!');
      } else {
        throw new Error('Editor instance not available');
      }
    } catch (error) {
      console.error('Error processing AI prompt:', error);
      toast.error('Failed to process AI prompt');
    } finally {
      setIsLoading(false);
    }
  };

  const saveContent = () => {
    const htmlContent = editorRef.current.getHtml();
    const cssContent = editorRef.current.getCss();
    const userId = localStorage.getItem('userId');
    setContent(htmlContent);
    setCss(cssContent);
    console.log('HTML Content:', htmlContent);
    console.log('CSS Content:', cssContent);
    const contentTypeUid = pageRef || 'home'; // Use pageref if available

    saveToContentstack(htmlContent, cssContent, userId, contentTypeUid)
      .then(() => {
        console.log('Content saved successfully.');
        toast.success('Content saved successfully.');
        router.push('/dashboard');
      })
      .catch((error) => {
        console.error('Error saving content:', error);
      });
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

  const handleAddCustomHtmlCss = () => {
    if (editorRef.current) {
      const styleTag = `<style>${customCss}</style>`;
      editorRef.current.addComponents(`${styleTag}${customHtml}`);
      setIsCustomModalOpen(false);
      setCustomHtml('');
      setCustomCss('');
      toast.success('Custom HTML/CSS added successfully!');
    } else {
      toast.error('Editor instance not available');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <div className="flex flex-col h-screen">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">UI Builder</h1>
            <button 
              onClick={saveContent} 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Save Content
            </button>
          </div>
        </header>
        
        <div className="flex-1 p-4">
          <div id="gjs" className="h-full border border-gray-300 rounded-lg shadow-lg bg-white"></div>
        </div>
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">AI Prompt</h2>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full h-32 p-2 border border-gray-300 rounded-md mb-4 resize-none"
              placeholder="Describe the component you want to create..."
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleAiPrompt}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-blue-400"
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isCustomModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Custom HTML/CSS</h2>
            <textarea
              value={customHtml}
              onChange={(e) => setCustomHtml(e.target.value)}
              className="w-full h-32 p-2 border border-gray-300 rounded-md mb-4 resize-none"
              placeholder="Enter your HTML here..."
            />
            <textarea
              value={customCss}
              onChange={(e) => setCustomCss(e.target.value)}
              className="w-full h-32 p-2 border border-gray-300 rounded-md mb-4 resize-none"
              placeholder="Enter your CSS here..."
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomHtmlCss}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Builder;
