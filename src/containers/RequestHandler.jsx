import React, {useState, useEffect} from 'react';
import ProgressIndicator from '../components/ProgressIndicator';
import NotFound from '../components/NotFound';
import ErrorPage from '../components/ErrorPage';

const RequestHandler = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState({});

    useEffect(() => {
        if (props.action) {
            setIsLoading(true);
            setResponse({});
            props.action()
                .then(response => {
                    setIsLoading(false);
                    setResponse(response);
                }).catch(error => {
                    setIsLoading(false);
                    setResponse(error.response);
                });
        }
    }, []);

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
