import React from 'react';
import ReactDOMClient from 'react-dom/client';
import ReactDOMServer from 'react-dom/server';

import App from './App';

import './index.css';


// Rendering in web browser
//
const root = ReactDOMClient.createRoot(document.querySelector('#root'));
root.render(<App />);


// Rendering on server side
//
const html = ReactDOMServer.renderToString(<App />);
console.log(html);  //TODO: send html from server