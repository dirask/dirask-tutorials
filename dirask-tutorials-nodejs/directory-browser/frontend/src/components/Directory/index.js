import {Link} from 'react-router-dom';

import {joinPath} from '../../utils/path';
import {renderSize} from '../../utils/size';
import {renderDatetime} from '../../utils/datetime';

import style from './styles.module.scss';


const Directory = ({frontendPath, backendPath, items}) => {
    return (
        <div>
            <div className={style.directoryPath}>/{backendPath}</div>
            <br />
            <div className={style.directoryItems}>
                <div className={style.directoryItem}>
                    <div className={style.directoryType}>Type</div>
                    <div className={style.directoryName}>Name</div>
                    <div className={style.directorySize}>Size</div>
                    <div className={style.directoryModified}>Modified</div>
                </div>
                <br />
                {backendPath && (
                    <div className={style.directoryItem}>
                        <div className={style.directoryType} />
                        <div className={style.directoryName}>
                            <Link className={style.directoryLink} to={joinPath(frontendPath, '..')}>...</Link>
                        </div>
                        <div className={style.directorySize} />
                        <div className={style.directoryModified} />
                    </div>
                )}
                {items?.directories?.map(item => {
                    const modified = new Date(item.modified);
                    return (
                        <div key={item.name} className={style.directoryItem}>
                            <div className={style.directoryType}>[DIR]</div>
                            <div className={style.directoryName}>
                                <Link className={style.directoryLink} to={joinPath(frontendPath, item.name)}>{item.name}</Link>
                            </div>
                            <div className={style.directorySize} />
                            <div className={style.directoryModified}>
                                {renderDatetime(modified)}
                            </div>
                        </div>
                    );
                })}
                {items?.files?.map(item => {
                    const modified = new Date(item.modified);
                    return (
                        <div key={item.name} className={style.directoryItem}>
                            <div className={style.directoryType} />
                            <div className={style.directoryName}>
                                <a className={style.directoryLink} href={joinPath('/api/directory', backendPath, item.name)}>{item.name}</a>
                            </div>
                            <div className={style.directorySize}>
                                {renderSize(item.size)}
                            </div>
                            <div className={style.directoryModified}>
                                {renderDatetime(modified)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Directory;