
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
    <div className="App">
      <div
        id="panel-section"
        style={{ height: "800px", overflowY: "visible" }}
      />
    </div>
  );
}

export default App;
