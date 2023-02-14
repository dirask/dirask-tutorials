import React, { memo } from 'react';


const DiraskIcon = (props) =>
{
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6.879 6.879" {...props}>
            <g transform="translate(-.396 -286.942)">
                <rect style={{fill: '#3085d6', stroke: 'none'}} width="6.879" height="6.879" x=".396" y="286.942" ry=".524"/>
                <path style={{fill: '#ffffff', stroke: 'none'}} d="M5.091 292.594h-.883v-.394h-.012q-.301.464-.886.464-.537 0-.864-.378-.327-.38-.327-1.06 0-.71.36-1.137.362-.428.946-.428.553 0 .771.397h.012v-1.702h.883zm-.867-1.392v-.215q0-.28-.162-.465-.162-.184-.422-.184-.293 0-.458.232-.165.23-.165.632 0 .377.159.581.16.204.442.204.268 0 .436-.215.17-.215.17-.57z"/>
            </g>
        </svg>
    );
};

export default memo(DiraskIcon);