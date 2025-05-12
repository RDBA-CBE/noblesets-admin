// import { useCallback, useEffect, useRef, useState } from 'react';

// const View = () => {
//     const editorRef = useRef(null);
//     const [editorInstance, setEditorInstance] = useState(null);
//     const [content, setContent] = useState('');

//     const [value, setValue] = useState<any>({
//         time: Date.now(),
//         blocks: [
//             {
//                 type: 'paragraph',
//                 data: {
//                     text: 'This is the default content.',
//                 },
//             },
//         ],
//         version: '2.19.0',
//     });
//     // let count = 0;
// // editor start

// let editors = { isReady: false };
// useEffect(() => {
//   if (!editors.isReady) {
//     editor();
//     editors.isReady = true;
//   }

//   return () => {
//     if (editorInstance) {
//       editorInstance?.blocks?.clear();
//     }
//   };
// }, [value, ]);


// // const editorRef = useRef(null); // Define a ref to hold the editor instance

// const editor = useCallback(() => {
//   // Check if the window object is available and if the editorRef.current is set
//   if (typeof window === 'undefined' || !editorRef.current) return;

//   // Ensure only one editor instance is created
//   if (editorInstance) {
//     return;
//   }

//   console.log('value: ', value);
//   // Dynamically import the EditorJS module
//   import('@editorjs/editorjs').then(({ default: EditorJS }) => {
//     // Create a new instance of EditorJS with the appropriate configuration
//     const editor = new EditorJS({
//       holder: editorRef.current,
//       data: value,
//       tools: {
//         // Configure tools as needed
//         header: {
//           class: require('@editorjs/header'),
//         },
//         list: {
//           class: require('@editorjs/list'),
//         },
//         table: {
//           class: require('@editorjs/table'),
//         },
//       },
//     });

//     // Set the editorInstance state variable
//     setEditorInstance(editor);
//   });

//   // Cleanup function to destroy the current editor instance when the component unmounts
//   return () => {
//     if (editorInstance) {
//       editorInstance?.blocks?.clear();
//     }
//   };
// }, [editorInstance, value]);

// // editor end

//     const handleSave = async () => {
//         if (editorInstance) {
//             try {
//                 const savedContent = await editorInstance.save();
//                 console.log('Editor content:', savedContent);
//                 setContent(JSON.stringify(savedContent, null, 2));
//             } catch (error) {
//                 console.error('Failed to save editor content:', error);
//             }
//         }
//     };

//     return (
//         <div className="panel mb-5  p-5">
//             <div ref={editorRef} className="mb-5 border border-gray-200"></div>
//             <p>Editor content: {content}</p>
//             <button onClick={handleSave} className="btn btn-primary">
//                 Save
//             </button>
//         </div>
//     );
// };

// export default View;




import React from 'react'

const view = () => {
  return (
    <div>view</div>
  )
}

export default view