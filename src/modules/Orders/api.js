import axios from 'axios';
import {stringify} from 'query-string';
import {authorize} from '../../api/payu';

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

export const getOrder = (extOrderId, accessToken) => axios(
    `${process.env.REACT_APP_API_HOST}/admin/orders/${extOrderId}`,
    {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    }
);

export const cancelOrder = async (extOrderId, accessToken) => {
    try {
        const {data: {access_token}} = await authorize();
        return axios(`${process.env.REACT_APP_API_HOST}/admin/orders/${extOrderId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            data: {
                payuToken: access_token,
            },
        });
    } catch (e) {
        return Promise.reject(e);
    };
};

export const deleteOrder = async (extOrderId, accessToken) => {
    try {
        const {data: {access_token}} = await authorize();
        return axios(`${process.env.REACT_APP_API_HOST}/admin/orders/${extOrderId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            data: {
                payuToken: access_token,
            },
        });
    } catch (e) {
        return Promise.reject(e);
    };
};

export const refundOrder = async (extOrderId, amount, accessToken) => {
    try {
        const {data: {access_token}} = await authorize();
        return await axios(`${process.env.REACT_APP_API_HOST}/admin/orders/${extOrderId}/refunds`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            data: {
                payuToken: access_token,
                refund: {
                    amount,
                    description: `Zwrot ${extOrderId}`,
                    bankDescription: `Zwrot ${extOrderId}`,
                    type: 'REFUND_PAYMENT_STANDARD',
                }
            },
        });
    } catch (e) {
        return Promise.reject(e);
    };
};