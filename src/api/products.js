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

export const getProduct = (slug) => axios(
    `${process.env.REACT_APP_API_HOST}/products/${slug}`,
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }
);

export const getAdminProducts = (params = {}, accessToken) => {
    const queryString = stringify(params);
    let url = `${process.env.REACT_APP_API_HOST}/admin/products`;
    if (queryString) {
        url += `?${queryString}`;
    }
    return axios(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
};

export const getAdminProduct = (productId, accessToken) => axios(
    `${process.env.REACT_APP_API_HOST}/admin/products/${productId}`,
    {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    }
);

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

export const updateProduct = (productId, data = {}, accessToken) => {
    return axios(`${process.env.REACT_APP_API_HOST}/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
        },
        data,
    });
};

export const deleteProduct = (productId, accessToken) => {
    return axios(`${process.env.REACT_APP_API_HOST}/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
        },
    });
};
