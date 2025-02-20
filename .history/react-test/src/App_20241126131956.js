import './App.css';
import React, { useState } from 'react';
function str2xml(str) {
  if (str.charCodeAt(0) === 65279) {
    // BOM sequence
    str = str.substr(1);
  }
  return new DOMParser().parseFromString(str, "text/xml");
}

// Get paragraphs as javascript array
function getParagraphs(content) {
  const zip = new PizZip(content);
  const xml = str2xml(zip.files["word/document.xml"].asText());
  const paragraphsXml = xml.getElementsByTagName("w:p");
  const paragraphs = [];

  for (let i = 0, len = paragraphsXml.length; i < len; i++) {
    let fullText = "";
    const textsXml = paragraphsXml[i].getElementsByTagName("w:t");
    for (let j = 0, len2 = textsXml.length; j < len2; j++) {
      const textXml = textsXml[j];
      if (textXml.childNodes) {
        fullText += textXml.childNodes[0].nodeValue;
      }
    }
    if (fullText) {
      paragraphs.push(fullText);
    }
  }
  return paragraphs;
}
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
        src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
          width="100%"
          height="500px"
          title="Office File Viewer"
        />
        
      )}
    </div>
  );
}

export default App;
