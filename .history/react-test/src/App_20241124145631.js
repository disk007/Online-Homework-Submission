import logo from './logo.svg';
import './App.css';
import React,{useRef,useEffect} from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

function App() {
  const viewer = useRef(null);
  const path = require('./output.docx')
  const docs = [
    { uri:  require('./PDFTRON_about.pdf') }, // Access file from the public folder
  ];
  return (
    <>
    <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />
    {/* <div className="MyComponent">
      <div className="header">React sample</div>
      <div className="webviewer" ref={viewer} style={{height: "100vh"}}></div>
    </div> */}
    </>
    
  );
}

export default App;
