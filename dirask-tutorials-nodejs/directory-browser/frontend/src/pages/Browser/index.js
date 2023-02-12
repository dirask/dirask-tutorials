import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import Directory from '../../components/Directory';


const Browser = () => {
    const { pathname: frontendPath} = useLocation();
    const { '*' : backendPath } = useParams();
    const [items, setItems] = useState(null);
    useEffect(
        () => {
            fetch('/api/directory/' + backendPath)
                .then(response => response.json())
                .then(items => setItems(items))
                .catch(error => alert('Data fetching error!'));
        },
        [backendPath]
    );
    return (
        <div>
          <Directory frontendPath={frontendPath} backendPath={backendPath} items={items} />
        </div>
    );
};

export default Browser;