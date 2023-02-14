import React from 'react';

import {useAutentication} from '../../hooks/autentication';
import Login from '../../components/Login';
import BrowserComposition from '../../compositions/BrowserComposition';

import style from './styles.module.scss';


const BrowserPage = () => {
    const {error, autenticated, ...controller} = useAutentication();
    const handleLogin = async (requestData) => {
        await controller.loginUser(requestData);
    };
    const handleLogout = async () => {
        await controller.logoutUser();
    };
    return (
        <div className={style.browser}>
          {autenticated === 'USER' && (
            <>
              <div className={style.browserNavigator}>
                <a href="#" onClick={handleLogout}>Logout</a>
              </div>
              <br />
            </>
          )}
          {error && (
            <>
              <div className={style.browserError}>{error}</div>
              <br />
            </>
          )}
          {(autenticated === 'USER' || autenticated === 'GUEST') && (< BrowserComposition />)}
          {autenticated === 'UNKNOWN' && (
            <div className={style.browserCover}>
              <Login className={style.browserLogin} onSubmit={handleLogin} />
            </div>
          )}
        </div>
    );
};

export default BrowserPage;