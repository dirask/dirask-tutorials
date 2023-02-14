import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import DiraskIcon from './components/icons/DiraskIcon';
// import IndexPage from './pages/IndexPage';
import BrowserPage from './pages/BrowserPage';

import style from './App.module.scss';


const App = () => {
    return (
        <Router>
          <div className={style.app}>
            <Routes>
{/*
              <Route path="/" element={<IndexPage />} />
              <Route path="/browser/*" element={<BrowserPage />} />
*/}
              <Route path="/*" element={<BrowserPage />} />
            </Routes>
            <div className={style.appLogo}>
              <DiraskIcon className={style.appIcon} />
              <span className={style.appText}>Online Secured Directory Browser<br />by Dirask</span>
            </div>
          </div>
        </Router>
    );
}

export default App;