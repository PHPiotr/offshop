import React from 'react';
import ProgressIndicator from '../components/ProgressIndicator';
import NotFound from '../components/NotFound';
import ErrorPage from '../components/ErrorPage';

const ErrorHandler = ({isLoading, response, children}) => {
    if (isLoading) {
        return <ProgressIndicator />;
    }
    if (response && response.status === 404) {
        return <NotFound/>
    }
    if (!response) {
        return <ErrorPage status="Błąd sieci" message="Brak odpowiedzi"/>
    }
    return children;
};

export default ErrorHandler;
