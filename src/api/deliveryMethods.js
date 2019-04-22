import axios from 'axios';
import {stringify} from 'query-string';

export const getDeliveryMethods = (params = {}) => {
    const queryString = stringify(params);
    let url = `${process.env.REACT_APP_API_HOST}/delivery-methods`;
    if (queryString) {
        url += `?${queryString}`;
    }
    return axios(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const createDeliveryMethod = (data = {}, accessToken) => {
    return axios(`${process.env.REACT_APP_API_HOST}/delivery-methods`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        data,
    });
};
