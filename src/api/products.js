import axios from 'axios';
import {stringify} from 'query-string';

export const getProducts = (params = {}) => {
    const queryString = stringify(params);
    let url = `${process.env.REACT_APP_API_HOST}/products`;
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

export const getProductsForAdmin = (params = {}) => {
    const queryString = stringify(params);
    let url = `${process.env.REACT_APP_API_HOST}/admin/products`;
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

export const createProduct = (data = {}, accessToken) => {
    return axios(`${process.env.REACT_APP_API_HOST}/admin/products`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
        },
        data,
    });
};
