import React, {Component, useState, useEffect} from 'react';
import ErrorHandler from './ErrorHandler';

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
    return <ErrorHandler isLoading={isLoading} response={response}>{children({isLoading, response})}</ErrorHandler>;
};

export default RequestHandler;
