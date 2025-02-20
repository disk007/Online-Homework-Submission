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

  // const handleFileUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const fileUrl = URL.createObjectURL(file);
  //     setFile(fileUrl)
  //     // setDocs((prevDocs) => [
  //     //   ...prevDocs,
  //     //   {
  //     //     uri: fileUrl,
  //     //     fileType: file.type.split('/')[1], // อ้างอิงประเภทไฟล์จาก MIME type
  //     //     fileName: file.name
  //     //   }
  //     // ]);
  //   }
  // };

  return (
    <div className="App">
      <iframe
        src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(docxUrl)}`}
        width="100%"
        height="500px"
        title="DOCX Viewer"
      />
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
