import './App.css';
import React, { useState } from 'react';
import OfficeViewer from "react-office-viewer";

function App() {
  const [docs, setDocs] = useState([
    { 
      uri: 'https://calibre-ebook.com/downloads/demos/demo.docx',
      fileType: "docx",
      fileName: "demo"
    },
    { 
      uri: require('./PDFTRON_about.pdf') 
    }
  ]);

  const docxFile = 'https://calibre-ebook.com/downloads/demos/demo.docx'


  return (
    <div className="App">
      <iframe
        src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(docxFile)}`}
        width="100%"
        height="500px"
        title="DOCX Viewer"
      />
    </div>
  );
}

export default App;
