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
    <div className="app-container">
      <div className="header">
        <h1>File Viewer</h1>
      </div>

      <div className="file-type-selector">
        <label>Select File Type:</label>
        <div>
          <label>
            <input
              type="radio"
              value="image"
              checked={fileType === "image"}
              onChange={handleFileTypeChange}
            />
            Image
          </label>
          <label>
            <input
              type="radio"
              value="video"
              checked={fileType === "video"}
              onChange={handleFileTypeChange}
            />
            Video
          </label>
          <label>
            <input
              type="radio"
              value="audio"
              checked={fileType === "audio"}
              onChange={handleFileTypeChange}
            />
            Audio
          </label>
          <label>
            <input
              type="radio"
              value="pdf"
              checked={fileType === "pdf"}
              onChange={handleFileTypeChange}
            />
            PDF
          </label>
          <label>
            <input
              type="radio"
              value="docx"
              checked={fileType === "docx"}
              onChange={handleFileTypeChange}
            />
            DOCX
          </label>
        </div>
      </div>

      {fileType && (
        <div className="file-selector">
          <label>Select a File:</label>
          <input
            type="file"
            accept={
              fileType === "image"
                ? "image/*"
                : fileType === "video"
                ? "video/*"
                : fileType === "audio"
                ? "audio/*"
                : fileType === "pdf"
                ? ".pdf"
                : fileType === "docx"
                ? ".docx"
                : ""
            }
            onChange={handleFileChange}
          />
        </div>
      )}

      <div className="file-preview">
        <h4>File Preview:</h4>
        <div className="preview-container">{renderFileViewer()}</div>
      </div>
    </div>
  );
}

export default App;
