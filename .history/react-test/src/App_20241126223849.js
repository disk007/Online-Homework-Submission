import React, { useState } from 'react';
import { useEffect } from 'react';
import * as docx from 'docx-preview';

function App() {
  const [file, setFile] = useState(null); // State for storing the uploaded file

  // Function to handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Effect hook to render the .docx file when it's selected
  useEffect(() => {
    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const arrayBuffer = e.target.result;
        docx.renderAsync(arrayBuffer, document.getElementById('panel-section'))
          .then(() => {
            console.log('docx: finished rendering');
          });
      };

      reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
    }
  }, [file]); // Runs whenever the `file` changes

  return (
    <div className="App">
      <h1>Upload and View DOCX File</h1>
      
      {/* Input for selecting a .docx file */}
      <input
        type="file"
        accept=".docx"
        onChange={handleFileChange}
      />
      
      <div
        id="panel-section"
        style={{ height: '800px', overflowY: 'scroll', marginTop: '20px' }}
      />
    </div>
  );
}

export default App;
