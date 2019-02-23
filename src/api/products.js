import {fetch} from 'whatwg-fetch';
import {stringify} from 'query-string';

export const getProducts = (params = {}) => {
    const queryString = stringify(params);
    let url = `${process.env.REACT_APP_API_HOST}/products`;
    if (queryString) {
        url += `?${queryString}`;
    }
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const createProduct = (data = {}, accessToken) => {
    return fetch(`${process.env.REACT_APP_API_HOST}/products`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
};
