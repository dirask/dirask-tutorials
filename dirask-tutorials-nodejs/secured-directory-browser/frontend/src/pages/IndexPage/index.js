import React from 'react';
import { Link } from 'react-router-dom';


const IndexPage = () => {
    return (
        <div>
          <Link to="/browser">Browse files</Link>
        </div>
    );
};

export default IndexPage;