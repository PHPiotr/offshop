import React from 'react';
import ProgressIndicator from './ProgressIndicator';
import NotFound from './NotFound';
import ErrorPage from './ErrorPage';
import useRequestHandler from '../hooks/useRequestHandler';

const RequestHandler = props => {

    const {isLoading, response} = useRequestHandler(() => props.action(), []);

    const {children} = props;

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

export default RequestHandler;
