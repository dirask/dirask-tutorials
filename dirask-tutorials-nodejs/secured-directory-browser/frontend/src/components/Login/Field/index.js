import React, {forwardRef} from 'react';

import style from './styles.module.scss';


const Field = forwardRef(({label, type}, ref) => {
    return (
      <div className={style.field}>
        <label className={style.fieldLabel}>{label}</label>
        <input className={style.fieldInput} ref={ref} type={type} />
      </div>
    );
});

export default Field;