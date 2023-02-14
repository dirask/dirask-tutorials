import React, {useRef} from 'react';

import Field from './Field';

import style from './styles.module.scss';


const Login = ({className, onSubmit}) => {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const handleSubmit = e => {
        e.preventDefault();
        const data = {
            username: usernameRef.current.value,
            password: passwordRef.current.value
        };
        onSubmit(data);
    };
    return (
        <form className={style.login + ' ' + className} onSubmit={handleSubmit} >
          <Field ref={usernameRef} label="Username:" type="text" />
          <Field ref={passwordRef} label="Password:" type="password" />
          <div className={style.loginNavigator}>
            <button className={style.loginButton} type="submit">Login</button>
          </div>
        </form>
    );
};

export default Login;