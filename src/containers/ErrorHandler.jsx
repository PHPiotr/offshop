import React from 'react';
import ProgressIndicator from '../components/ProgressIndicator';
import NotFound from '../components/NotFound';

const ErrorHandler = ({isLoading, response, children}) => {
    if (isLoading) {
        return <ProgressIndicator />;
    }
    if (response.status === 404) {
        return <NotFound/>
    }
    return children;
};

export default ErrorHandler;
