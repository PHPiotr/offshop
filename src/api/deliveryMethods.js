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

export const getAdminDeliveryMethods = (params = {}, accessToken) => {
    const queryString = stringify(params);
    let url = `${process.env.REACT_APP_API_HOST}/admin/delivery-methods`;
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

export const getAdminDeliveryMethod = (deliveryMethodId, accessToken) => axios(
    `${process.env.REACT_APP_API_HOST}/admin/delivery-methods/${deliveryMethodId}`,
    {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    }
);

export const createDeliveryMethod = (data = {}, accessToken) => {
    return axios(`${process.env.REACT_APP_API_HOST}/admin/delivery-methods`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        data,
    });
};

export const updateDeliveryMethod = (deliveryMethodId, data = {}, accessToken) => {
    return axios(`${process.env.REACT_APP_API_HOST}/admin/delivery-methods/${deliveryMethodId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        data,
    });
};

export const deleteDeliveryMethod = (deliveryMethodId, accessToken) => {
    return axios(`${process.env.REACT_APP_API_HOST}/admin/delivery-methods/${deliveryMethodId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
};

