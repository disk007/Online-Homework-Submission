
import React, { useState } from 'react';
import FileViewer from "react-file-viewer";
import doc from "./output.docx";
import { useEffect } from "react";
import * as docx from "docx-preview";

function App() {
    useEffect(() => {
        fetch(doc).then((res) => {
          const template = res.arrayBuffer();
          docx
            .renderAsync(template, document.getElementById("panel-section"))
            .then((x) => console.log("docx: finished"));
          console.log("buffer: ", template);
        });
      }, []);

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
