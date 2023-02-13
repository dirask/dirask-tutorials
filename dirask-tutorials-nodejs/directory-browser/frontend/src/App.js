import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import DiraskIcon from './components/icons/DiraskIcon';
import Index from './pages/Index';
import Browser from './pages/Browser';

import style from './App.module.scss';


const App = () => {
    return (
        <Router>
          <div className={style.app}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/browser/*" element={<Browser />} />
            </Routes>
            <div className={style.appLogo}>
              <DiraskIcon className={style.appIcon} />
              <span className={style.appText}>Online Directory Browser<br />by Dirask</span>
            </div>
          </div>
        </Router>
    );
}

export default App;