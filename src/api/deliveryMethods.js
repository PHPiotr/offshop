import {fetch} from 'whatwg-fetch';
import {stringify} from 'query-string';

export const getDeliveryMethods = (params = {}) => {
    const queryString = stringify(params);
    let url = `${process.env.REACT_APP_API_HOST}/delivery-methods`;
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

export const createDeliveryMethod = (data = {}, accessToken) => {
    return fetch(`${process.env.REACT_APP_API_HOST}/delivery-methods`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        body: data,
    });
};
