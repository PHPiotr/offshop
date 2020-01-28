import axios from 'axios';
import {stringify} from 'query-string';

const baseURL = process.env.REACT_APP_API_HOST;

const publicRequest = method => async (url, query = {}, data = null) => {
    const queryString = stringify(query);
    return axios({
        baseURL,
        url: queryString ? `${url}?${queryString}` : url,
        data,
        method,
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

const privateRequest = method => accessToken => async (url, query = {}, data = null, customHeaders = {}) => {
    const queryString = stringify(query);
    return axios({
        baseURL,
        url: queryString ? `${url}?${queryString}` : url,
        data,
        method,
        cache: 'no-cache',
        crossDomain: true,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            ...customHeaders,
        },
    });
};

export const getRequestPublic = publicRequest('get');
export const getRequestPrivate = privateRequest('get');
export const putRequestPrivate = privateRequest('put');
export const postRequestPrivate = privateRequest('post');
export const deleteRequestPrivate = privateRequest('delete');
