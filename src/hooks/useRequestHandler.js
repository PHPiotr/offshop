import {useEffect, useState} from 'react';

const useRequestHandler = (action, deps = []) => {

    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState({});

    useEffect(() => {
        setIsLoading(true);
        setResponse({});
        action()
            .then(response => {
                setIsLoading(false);
                setResponse(response);
            }).catch(error => {
                setIsLoading(false);
                setResponse(error.response);
            });
    }, deps);

    return {isLoading, response};
};

export default useRequestHandler;
