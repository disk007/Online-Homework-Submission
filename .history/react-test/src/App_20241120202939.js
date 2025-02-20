import logo from './logo.svg';
import './App.css';
import WebViewer from '@pdftron/webviewer';
import React,{useRef,useEffect} from 'react';

function App() {
  const viewer = useRef(null);
  useEffect(() => {
    if (viewer.current) {
        WebViewer(
            {
                path: '../webviewer/lib',
                licenseKey: 'demo:1732087848460:7ef2e39503000000007d6961b49b470276001b210dfb236dd3c37e7e41',
                initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
            },
            viewer.current,
        ).then((instance) => {
            const { documentViewer, annotationManager } = instance.Core;

    documentViewer.addEventListener('documentLoaded', () => {
      instance.UI.openElements(['notesPanel']);
    });

    documentViewer.addEventListener('annotationsLoaded', () => {
      const annots = annotationManager.getAnnotationsList();
      annots.forEach((annot) => {
        if (annot.PageNumber === 1) {
          // Do something
        }
      });
    });

    iinstance.UI.loadDocument('...');
        }).catch((error) => {
            console.error("WebViewer error:", error);
        });
    }
}, []);
  return (
    <>
    <div className="MyComponent">
      <div className="header">React sample</div>
      <div className="webviewer" ref={viewer} style={{height: "100vh"}}></div>
    </div>
    </>
    
  );
}

export default App;
