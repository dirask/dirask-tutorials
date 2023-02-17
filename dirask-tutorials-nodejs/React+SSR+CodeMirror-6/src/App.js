import React from 'react';

import CodeMirror6 from './CodeMirror6';

import './App.css';


const App = () => {
    const code1 = 'for (let i = 0; i < 10; ++i) {\n' +
                  '    console.log(`i: ${i}`);\n' +
                  '}';
    const code2 = '<html>\n' +
                  '<body>\n' +
                  '  <script>\n' +
                  '\n' +
                  '    for (let i = 0; i < 10; ++i) {\n' +
                  '        console.log(`i: ${i}`);\n' +
                  '    }\n' +
                  '\n' +
                  '  </script>\n' +
                  '  <div class="message">Hi there!</div>\n' +
                  '</body>\n' +
                  '</html>';
    return (
        <div className="App">
          <CodeMirror6 language="JavaScript" code={code1} />
          <CodeMirror6 language="HTML" code={code2} />
        </div>
    );
};

export default App;