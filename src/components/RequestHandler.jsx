import React, {useEffect, useState} from 'react';
import ProgressIndicator from './ProgressIndicator';
import ErrorPage from './ErrorPage';

const RequestHandler = props => {

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        (async () => {
            try {
                await props.action();
            } catch (e) {
                setError(e);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const {children} = props;

    if (isLoading) {
        return <ProgressIndicator />;
    }
    if (error) {
        return <ErrorPage status={error.status} message={error.message}/>;
    }

    return children;
};

export default RequestHandler;
