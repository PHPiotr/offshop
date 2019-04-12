import {fetch} from 'whatwg-fetch';

export const getPayMethods = () => {
    let url = `${process.env.REACT_APP_API_HOST}/pay-methods`;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
