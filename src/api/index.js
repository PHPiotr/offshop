import axios from 'axios';
import {stringify} from 'query-string';

const baseURL = process.env.REACT_APP_API_HOST;

const publicRequest = method => async (url, query = {}, data = null) => {
    const queryString = stringify(query);
    try {
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
    } catch (e) {
        throw e;
    }
};

export const getRequestPublic = publicRequest('get');
