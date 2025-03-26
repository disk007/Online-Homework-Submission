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
    <Container className="mt-4">
      <Row>
        <Col>
          <h1>File Viewer</h1>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form>
            <Form.Label>Select File Type:</Form.Label>
            <div>
              <Form.Check
                inline
                label="Image"
                type="radio"
                value="image"
                checked={fileType === "image"}
                onChange={handleFileTypeChange}
              />
              <Form.Check
                inline
                label="Video"
                type="radio"
                value="video"
                checked={fileType === "video"}
                onChange={handleFileTypeChange}
              />
              <Form.Check
                inline
                label="Audio"
                type="radio"
                value="audio"
                checked={fileType === "audio"}
                onChange={handleFileTypeChange}
              />
              <Form.Check
                inline
                label="PDF"
                type="radio"
                value="pdf"
                checked={fileType === "pdf"}
                onChange={handleFileTypeChange}
              />
              <Form.Check
                inline
                label="DOCX"
                type="radio"
                value="docx"
                checked={fileType === "docx"}
                onChange={handleFileTypeChange}
              />
            </div>
          </Form>
        </Col>
      </Row>
      {fileType && (
        <Row className="mb-3">
          <Col>
            <Form>
              <Form.Label>Select a File:</Form.Label>
              <Form.Control
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
            </Form>
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <h4>File Preview:</h4>
          <div style={{ border: "1px solid #ddd", padding: "10px" }}>
            {renderFileViewer()}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
