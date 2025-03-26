import './App.css';
import React, { useState } from 'react';

function App() {
  const [fileUrl, setFileUrl] = useState("");
  const docxFile = 'https://calibre-ebook.com/downloads/demos/demo.docx'

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // สร้าง URL ของไฟล์ที่อัปโหลด
      const url = URL.createObjectURL(file);
      setFileUrl(url);
    }
  };

  return (
    <div className="App">
      <h1>Upload and View Office Files</h1>
      <input
        type="file"
        accept=".docx,.xlsx"
        onChange={handleFileUpload}
        style={{ marginBottom: "20px" }}
      />
      {fileUrl && (
        <iframe
          src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(docxFile)}`}
          width="100%"
          height="500px"
          title="Office File Viewer"
        />
      )}
    </div>
  );
}

export default App;
