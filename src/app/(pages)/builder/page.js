'use client';
import { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import 'grapesjs/dist/css/grapes.min.css';

const Builder = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = grapesjs.init({
      container: '#gjs',
      height: '600px',
      width: '100%',
      storageManager: false,
      plugins: [gjsBlocksBasic],
      blockManager: {
        appendTo: '#blocks-manager',
      },
      layerManager: {
        appendTo: '.layers-container',
      },
      panels: {
        defaults: [
          {
            id: 'panel-devices',
            el: '.panel__devices',
            buttons: [
              { id: 'device-desktop', label: 'Desktop', command: 'set-device-desktop', active: true, togglable: false },
              { id: 'device-tablet', label: 'Tablet', command: 'set-device-tablet', togglable: false },
              { id: 'device-mobile', label: 'Mobile', command: 'set-device-mobile', togglable: false },
            ],
          },
          {
            id: 'panel-options',
            el: '.panel__options',
            buttons: [
              { id: 'undo', className: 'fa fa-undo', command: 'undo' },
              { id: 'redo', className: 'fa fa-repeat', command: 'redo' },
              { id: 'export', className: 'fa fa-code', command: 'export-template' },
              { id: 'preview', className: 'fa fa-eye', command: 'preview' },
            ],
          },
        ],
      },
      styleManager: {
        sectors: [
          {
            name: 'General',
            open: true,
            properties: [
              { name: 'Width', property: 'width', type: 'length' },
              { name: 'Height', property: 'height', type: 'length' },
              { name: 'Background Color', property: 'background-color', type: 'color' },
              { name: 'Margin', property: 'margin', type: 'length' },
              { name: 'Padding', property: 'padding', type: 'length' },
              {
                name: 'Border',
                property: 'border',
                type: 'composite',
                units: ['px', 'em', 'rem'],
                properties: [
                  { name: 'Width', property: 'border-width', type: 'length' },
                  { name: 'Style', property: 'border-style', type: 'select', options: [
                      { value: 'none', name: 'None' },
                      { value: 'solid', name: 'Solid' },
                      { value: 'dashed', name: 'Dashed' },
                      { value: 'dotted', name: 'Dotted' },
                    ] 
                  },
                  { name: 'Color', property: 'border-color', type: 'color' },
                ],
              },
            ],
          },
          {
            name: 'Typography',
            open: true,
            properties: [
              { name: 'Font Size', property: 'font-size', type: 'select', options: [
                  { value: '12px', name: '12px' },
                  { value: '14px', name: '14px' },
                  { value: '16px', name: '16px' },
                  { value: '20px', name: '20px' },
                  { value: '24px', name: '24px' },
                ]
              },
              { name: 'Font Family', property: 'font-family', type: 'select', options: [
                  { value: 'Arial, sans-serif', name: 'Arial' },
                  { value: 'Georgia, serif', name: 'Georgia' },
                  { value: 'Courier New, monospace', name: 'Courier' },
                  { value: 'Times New Roman, serif', name: 'Times' },
                ]
              },
              { name: 'Text Color', property: 'color', type: 'color' },
              { name: 'Background Color', property: 'background-color', type: 'color' },
              { name: 'Bold', property: 'font-weight', type: 'select', options: [
                  { value: 'normal', name: 'Normal' },
                  { value: 'bold', name: 'Bold' },
                ]
              },
              { name: 'Text Align', property: 'text-align', type: 'select', options: [
                  { value: 'left', name: 'Left' },
                  { value: 'center', name: 'Center' },
                  { value: 'right', name: 'Right' },
                ]
              },
            ],
          },
        ],
      },
      selectorManager: { appendTo: '.styles-container' },
      traitManager: {
        appendTo: '.traits-container',
      },
    });

    editorRef.current = editor;

    return () => {
      editor.destroy();
    };
  }, []);

  return (
    <div className="editor-wrap" style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f0f0' }}>
      <div className="panel__left" style={{ width: '240px', backgroundColor: '#333', color: '#fff' }}>
        <div className="layers-container" style={{ padding: '15px' }}>
          <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: 'bold' }}>Layers</h3>
        </div>
        <div id="blocks-manager" style={{ padding: '15px' }}>
          <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: 'bold' }}>Blocks</h3>
        </div>
      </div>
      <div className="editor-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="panel__top" style={{ padding: '10px', backgroundColor: '#444', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
          <div className="panel__devices"></div>
          <div className="panel__options"></div>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div id="gjs" style={{ width: '100%', height: '100%', border: '1px solid #ddd', backgroundColor: '#fff' }}></div>
        </div>
      </div>
      <div className="panel__right" style={{ width: '240px', backgroundColor: '#333', color: '#fff' }}>
        <div className="styles-container" style={{ padding: '15px' }}>
          <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: 'bold' }}>Styles</h3>
        </div>
        <div className="traits-container" style={{ padding: '15px' }}>
          <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: 'bold' }}>Properties</h3>
        </div>
      </div>
    </div>
  );
};

export default Builder;
