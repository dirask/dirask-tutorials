import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import Directory from '../../components/Directory';

import style from './styles.module.scss';


const Browser = () => {
    const { pathname: frontendPath} = useLocation();
    const { '*' : backendPath } = useParams();
    const [error, setError] = useState(null);
    const [items, setItems] = useState(null);
    useEffect(
        () => {
            let destroyed = false;
            fetch('/api/directory/' + backendPath)
                .then(response => {
                    if (destroyed) {
                        return;
                    }
                    return response.json();
                })
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
                        setError('Data fetching error!');
                    }
                })
                .catch(error => {
                    if (destroyed) {
                        return;
                    }
                    setItems(null)
                    setError('Data fetching error!');
                });
            return () => {
                destroyed = true;
            };
        },
        [backendPath]
    );
    return (
        <div>
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

export default Browser;