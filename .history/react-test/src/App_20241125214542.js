import './App.css';
import React, { useState } from 'react';
import Viewer from "react-office-viewer"

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

  const [file,setFile] = useState([])

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setFile(fileUrl)
      // setDocs((prevDocs) => [
      //   ...prevDocs,
      //   {
      //     uri: fileUrl,
      //     fileType: file.type.split('/')[1], // อ้างอิงประเภทไฟล์จาก MIME type
      //     fileName: file.name
      //   }
      // ]);
    }
  };

  return (
    <div className="App">
      {/* <input
        type="file"
        accept=".docx,.pdf"
        onChange={handleFileUpload}
        style={{ marginBottom: "20px" }}
      />
      <Viewer file={ file }/> */}
    </div>
  );
}

export default App;
