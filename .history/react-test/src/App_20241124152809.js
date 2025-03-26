import React, { useRef } from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

function App() {
  const docs = [
    { uri: process.env.PUBLIC_URL + '/PDFTRON_about.pdf' }, // ถ้าไฟล์อยู่ใน public folder
    { uri: process.env.PUBLIC_URL + '/output.docx' }
  ];

  return (
    <DocViewer 
      documents={docs} 
      pluginRenderers={DocViewerRenderers}
      config={{
        header: {
          disableHeader: false,
          disableFileName: false
        }
      }} 
    />
  );
}

export default App;