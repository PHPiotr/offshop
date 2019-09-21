import React from 'react';
import ProgressIndicator from '../components/ProgressIndicator';
import NotFound from '../components/NotFound';

const ErrorHandler = ({loading, response, children}) => {
    if (loading) {
        return <ProgressIndicator />;
    }
    if (response.status === 404) {
        return <NotFound/>
    }
    return children;
};

export default ErrorHandler;
