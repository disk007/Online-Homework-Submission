import logo from './logo.svg';
import './App.css';
import WebViewer from '@pdftron/webviewer';
import {useRef} from 'react';

function App() {
  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        licenseKey: 'demo:1732087848460:7ef2e39503000000007d6961b49b470276001b210dfb236dd3c37e7e41',
        initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
      },
      viewer.current,
    ).then((instance) => {
        const { documentViewer } = instance.Core;
        // you can now call WebViewer APIs here...
      });
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
