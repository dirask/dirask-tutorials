import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import {fetchData} from '../../utils/request';
import Directory from '../../components/Directory';

import style from './styles.module.scss';


const BrowserComposition = () => {
    const { pathname: frontendPath} = useLocation();
    const { '*': backendPath } = useParams();
    const [error, setError] = useState(null);
    const [items, setItems] = useState(null);
    useEffect(
        () => {
            let destroyed = false;
            fetchData('/api/directory/' + backendPath)
                .then(data => {
                    if (destroyed) {
                        return;
                    }
                    if (data.result) {
                        setItems({
                            directories: data.directories,
                            files: data.files
                        });
                        setError(null);
                    } else {
                        setItems(null)
                        setError(data.message ?? 'Directory data fetching error!');
                    }
                })
                .catch(error => {
                    if (destroyed) {
                        return;
                    }
                    setItems(null)
                    setError('Directory data fetching error!');
                });
            return () => {
                destroyed = true;
            };
        },
        [backendPath]
    );
    return (
        <div className={style.browser}>
          {error && (
            <>
              <div className={style.browserError}>{error}</div>
              <br />
            </>
          )}
          <Directory frontendPath={frontendPath} backendPath={backendPath} items={items} />
        </div>
    );
};

export default BrowserComposition;