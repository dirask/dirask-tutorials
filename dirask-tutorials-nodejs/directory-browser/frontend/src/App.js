import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Index from './pages/Index';
import Browser from './pages/Browser';

import './App.css';


const App = () => {
    return (
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/browser/*" element={<Browser />} />
            </Routes>
          </div>
        </Router>
    );
}

export default App;