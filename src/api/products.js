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
