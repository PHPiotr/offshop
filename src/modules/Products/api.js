import axios from 'axios';
import {stringify} from 'query-string';

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
        validateStatus: status => [201, 422].indexOf(status) > -1,
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
        validateStatus: status => [200, 422].indexOf(status) > -1,
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
