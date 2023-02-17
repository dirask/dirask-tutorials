// NOTE: CodeMirror 6 contributors recommend to use `@lezer/highlight` package to highlight source code outside CodeMirror 6 DOM based version.


// -- dependencies -------------------------------------------

import React from 'react';                                                     // npm install react

import {highlightTree, classHighlighter} from '@lezer/highlight';              // npm install @lezer/highlight

import {javascript as JAVASCRIPT_SUPPORT} from '@codemirror/lang-javascript';  // npm install @codemirror/lang-javascript
import {json as JSON_SUPPORT} from '@codemirror/lang-json';                    // npm install @codemirror/lang-json
import {css as CSS_SUPPORT} from '@codemirror/lang-css';                       // npm install @codemirror/lang-css
import {html as HTML_SUPPORT} from '@codemirror/lang-html';                    // npm install @codemirror/lang-html
import {xml as XML_SUPPORT} from '@codemirror/lang-xml';                       // npm install @codemirror/lang-xml
import {cpp as CPP_SUPPORT} from '@codemirror/lang-cpp';                       // npm install @codemirror/lang-cpp
import {java as JAVA_SUPPORT} from '@codemirror/lang-java';                    // npm install @codemirror/lang-java
import {php as PHP_SUPPORT} from '@codemirror/lang-php';                       // npm install @codemirror/lang-php
import {python as PYTHON_SUPPORT} from '@codemirror/lang-python';              // npm install @codemirror/lang-python
import {rust as RUST_SUPPORT} from '@codemirror/lang-rust';                    // npm install @codemirror/lang-rust
import {sql as SQL_SUPPORT} from '@codemirror/lang-sql';                       // npm install @codemirror/lang-sql
import {markdown as MARKDOWN_SUPPORT} from '@codemirror/lang-markdown';        // npm install @codemirror/lang-markdown

import './styles.css';


// -- utils --------------------------------------------------

// Source: https://dirask.com/snippets/JavaScript-iterate-through-lines-in-indicated-text-used-newline-symbols-r-n-n-r-n-r-jmLoAp
//
const iterateLines = (text, callback) => {
    let pointer = 0;
    for (let i = 0; i < text.length; i += 1) {
        switch (text[i]) {
            case '\r':
                callback(pointer, i);
                if (text[i + 1] === '\n') {
                    i += 1;
                }
                pointer = i + 1;
                break;
            case '\n':
                callback(pointer, i);
                if (text[i + 1] === '\r') {
                    i += 1;
                }
                pointer = i + 1;
                break;
        }
    }
    callback(pointer, text.length);
};

// -- CodeMirror --------------------------------------------

const LANGUAGE_SUPPORTS = {
    'JavaScript': () => JAVASCRIPT_SUPPORT(),
    'TypeScript': () => JAVASCRIPT_SUPPORT({ typescript: true }),
    'JSX': () => JAVASCRIPT_SUPPORT({ jsx: true }),
    'TSX': () => JAVASCRIPT_SUPPORT({ typescript: true, jsx: true }),
    'JSON': () => JSON_SUPPORT(),
    'CSS': () => CSS_SUPPORT(),
    'HTML': () => HTML_SUPPORT(),
    'XML': () => XML_SUPPORT(),
    'CPP': () => CPP_SUPPORT(),
    'Java': () => JAVA_SUPPORT(),
    'PHP': () => PHP_SUPPORT(),
    'Python': () => PYTHON_SUPPORT(),
    'Rust': () => RUST_SUPPORT(),
    'SQL': () => SQL_SUPPORT(),
    'Markdown': () => MARKDOWN_SUPPORT()
    //
    // Hint: check https://codemirror.net website to find language supports (`Language Support` section)     
};

const createTree = (language, code) => {
    const creator = LANGUAGE_SUPPORTS[language];
    if (creator) {
        const support = creator();
        return support.language.parser.parse(code);
    }
    return null;
};

const EditorGutters = ({code}) => {
    let counter = 0;
    let numbers = '';
    iterateLines(code, () => {
        if (numbers) {
            numbers += '\n';
        }
        numbers += String(++counter);
    });
    return (
        <div className="cm-gutters">
          {numbers}
        </div>
    );
};

const EditorContent = ({language, code}) => {
    const elements = [];
    const tree = createTree(language, code);
    if (tree) {
        let index = 0;
        const construct = (from, to, token) => {
            if (index < from) {
                elements.push(code.substring(index, from));
            }
            elements.push(<span key={from} className={`cm-${token.substring(4)}`}>{code.substring(from, to)}</span>);
            index = to;
        };
        highlightTree(tree, classHighlighter, construct);
        if (index < code.length) {
            elements.push(code.substring(index));
        }
    } else {
        elements.push(code);
    }
    return (
        <code className="cm-content">
          {elements}
        </code>
    );
};

const CodeMirror6 = ({language, code}) => {
    return (
        <pre className="cm-editor">
          <EditorGutters code={code} />
          <EditorContent language={language} code={code} />
        </pre>
    );
};

export default CodeMirror6;