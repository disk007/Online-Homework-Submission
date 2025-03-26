import logo from './logo.svg';
import './App.css';
import React,{useRef,useEffect} from 'react';
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

function App() {
  const viewer = useRef(null);
  const docs = [
    { uri: require("./output.docx") }, // Local File
  ];
  return (
    <>
    <DocViewer documents={docs} />
    {/* <div className="MyComponent">
      <div className="header">React sample</div>
      <div className="webviewer" ref={viewer} style={{height: "100vh"}}></div>
    </div> */}
    </>
    
  );
}

export default App;
