import { useState, useEffect, useMemo } from 'react';

import {fetchData, sendData} from '../utils/request';


export const useAutentication = () => {
    const [error, setError] = useState(null);
    const [autenticated, setAutenticated] = useState(null);
    useEffect(
        () => {
            let destroyed = false;
            fetchData('/api/user/check')
                .then(data => {
                    if (destroyed) {
                        return;
                    }
                    setError(null);
                    setAutenticated(data.result ? data.mode : 'UNKNOWN');
                })
                .catch(error => {
                    if (destroyed) {
                        return;
                    }
                    setError('User data fetching error!');
                });
            return () => {
                destroyed = true;
            };
        },
        []
    );
    const controller = useMemo(
        () => {
            const loginUser = async (requestData) => {
                try {
                    const responseData = await sendData(`/api/user/login`, requestData);
                    if (responseData.result) {
                        setError(null);
                        setAutenticated('USER');
                    } else {
                        setError(responseData.message ?? 'Login user error!');
                    }
                } catch (error) {
                    setError('Login user error!');
                }
            };
            const logoutUser = async () => {
                try {
                    const responseData = await fetchData(`/api/user/logout`);
                    if (responseData.result) {
                        setError(null);
                        setAutenticated('UNKNOWN');
                    } else {
                        setError(responseData.message ?? 'Login user error!');
                    }
                } catch (error) {
                    setError('Logout user error!');
                }
            };
            return {loginUser, logoutUser}
        },
        []
    );
    return {...controller, autenticated, error};
};