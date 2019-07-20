import axios from 'axios';
import {stringify} from 'query-string';

export const getAdminOrders = (params = {}, accessToken) => {
    const queryString = stringify(params);
    let url = `${process.env.REACT_APP_API_HOST}/admin/orders`;
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

export const deleteOrder = (deliveryMethodId, accessToken) => {
    return axios(`${process.env.REACT_APP_API_HOST}/admin/orders/${deliveryMethodId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
};
