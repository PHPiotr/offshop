import {normalize} from 'normalizr';
import {getOrder, cancelOrder} from '../../api/orders';
import * as orderSchema from '../../schemas/ordersSchema';

export const RETRIEVE_ADMIN_ORDER_REQUEST = 'RETRIEVE_ADMIN_ORDER_REQUEST';
export const RETRIEVE_ADMIN_ORDER_SUCCESS = 'RETRIEVE_ADMIN_ORDER_SUCCESS';
export const RETRIEVE_ADMIN_ORDER_FAILURE = 'RETRIEVE_ADMIN_ORDER_FAILURE';
export const CANCEL_ORDER_REQUEST = 'CANCEL_ORDER_REQUEST';
export const CANCEL_ORDER_SUCCESS = 'CANCEL_ORDER_SUCCESS';
export const CANCEL_ORDER_FAILURE = 'CANCEL_ORDER_FAILURE';

export const getOrderIfNeeded = extOrderId => {
    return async (dispatch, getState) => {
        const {adminOrder: {isFetching}, auth: {accessToken}} = getState();
        if (isFetching) {
            return;
        }

        dispatch({type: RETRIEVE_ADMIN_ORDER_REQUEST});
        try {
            const {data} = await getOrder(extOrderId, accessToken);
            const payload = normalize(data, orderSchema.order);
            dispatch({type: RETRIEVE_ADMIN_ORDER_SUCCESS, payload});

            return payload;
        } catch (error) {
            dispatch({type: RETRIEVE_ADMIN_ORDER_FAILURE, payload: {error}});

            return error;
        }
    };
};

export const cancelOrderIfNeeded = (extOrderId, status) => {
    return async (dispatch, getState) => {
        const {auth: {accessToken}} = getState();
        if (status === 'CANCELED' || status === 'COMPLETED') {
            return;
        }
        try {
            dispatch({type: CANCEL_ORDER_REQUEST, payload: {status: 'CANCELED'}});
            const {data} = await cancelOrder(extOrderId, accessToken);
            dispatch({type: CANCEL_ORDER_SUCCESS, payload: {status: data.status}});
        } catch (error) {
            dispatch({type: CANCEL_ORDER_FAILURE, payload: {status, error}});
        }
    };
};