import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import { FileViewer } from 'react-file-viewer-v2'

function App() {
  const file = './ใบงาน Mobile Programming ใบงาน 7 สำหรับนักศึกษา 2 (3).docx'
  const type = 'docx'
  return (
    <div className="App">
      <FileViewer
        fileType={type}
        filePath={file}/>
    </div>
  );
}

export default App;
