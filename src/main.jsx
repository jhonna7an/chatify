import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// import { ComboboxPopover } from './components/CodeSelector.jsx';
import { CodeSelector } from './components/CodeSelector.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {/* <ComboboxPopover/> */}
    {/* <CodeSelector /> */}
  </React.StrictMode>,
)
