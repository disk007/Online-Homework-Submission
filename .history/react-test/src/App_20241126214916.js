import './App.css';
import React, { useState } from 'react';
import FileViewer from "react-file-viewer";

function App() {
  const [fileType, setFileType] = useState("image");
  const [file, setFile] = useState(null);

  const handleFileTypeChange = (e) => {
    setFileType(e.target.value);
    setFile(null); // Reset file when type changes
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setFile(fileURL);
    }
  };

  const renderFileViewer = () => {
    if (!file) {
      return <p className="text-muted">No file selected. Please upload a file.</p>;
    }

    if (["pdf", "docx"].includes(fileType)) {
      return (
        <FileViewer
          fileType={fileType}
          filePath={file}
          errorComponent={() => <p>Error loading file</p>}
        />
      );
    }

    if (["image"].includes(fileType)) {
      return <img src={file} alt="Uploaded File" style={{ maxWidth: "100%" }} />;
    }

    if (["video"].includes(fileType)) {
      return <video controls style={{ width: "100%" }} src={file} />;
    }

    if (["audio"].includes(fileType)) {
      return <audio controls src={file} />;
    }

    return <p className="text-danger">Unsupported file type selected.</p>;
  };

  return (
    <div className="App">
      <input type="file" onChange={onFileUpload} name="docx-reader" />;
      <div>
        {paragraphs.length > 0 ? (
          paragraphs.map((para, index) => (
            <p key={index}>{para}</p>
          ))
        ) : (
          <p>No content found</p>
        )}
      </div>
    </div>
  );
}

export default App;
