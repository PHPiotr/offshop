import {normalize} from 'normalizr';
import {getOrder, cancelOrder, deleteOrder, refundOrder} from '../../api/orders';
import * as orderSchema from '../../schemas/ordersSchema';

export const RETRIEVE_ADMIN_ORDER_REQUEST = 'RETRIEVE_ADMIN_ORDER_REQUEST';
export const RETRIEVE_ADMIN_ORDER_SUCCESS = 'RETRIEVE_ADMIN_ORDER_SUCCESS';
export const RETRIEVE_ADMIN_ORDER_FAILURE = 'RETRIEVE_ADMIN_ORDER_FAILURE';
export const CANCEL_ORDER_REQUEST = 'CANCEL_ORDER_REQUEST';
export const CANCEL_ORDER_SUCCESS = 'CANCEL_ORDER_SUCCESS';
export const CANCEL_ORDER_FAILURE = 'CANCEL_ORDER_FAILURE';
export const REFUND_ORDER_REQUEST = 'REFUND_ORDER_REQUEST';
export const REFUND_ORDER_SUCCESS = 'REFUND_ORDER_SUCCESS';
export const REFUND_ORDER_FAILURE = 'REFUND_ORDER_FAILURE';
export const DELETE_ORDER_REQUEST = 'DELETE_ORDER_REQUEST';
export const DELETE_ORDER_SUCCESS = 'DELETE_ORDER_SUCCESS';
export const DELETE_ORDER_FAILURE = 'DELETE_ORDER_FAILURE';

export const getOrderIfNeeded = extOrderId => {
    return async (dispatch, getState) => {
        const {adminOrder: {isFetching}, auth: {accessToken}} = getState();
        if (isFetching) {
            return;
        }

        dispatch({type: RETRIEVE_ADMIN_ORDER_REQUEST});
        try {
            const response = await getOrder(extOrderId, accessToken);
            const {data} = response;
            const payload = normalize(data, orderSchema.order);
            dispatch({type: RETRIEVE_ADMIN_ORDER_SUCCESS, payload});

            return response;
        } catch (error) {
            dispatch({type: RETRIEVE_ADMIN_ORDER_FAILURE, payload: {error}});

            return error.response;
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

export const refundOrderIfNeeded = (extOrderId, amount) => {
    return async (dispatch, getState) => {
        const {auth: {accessToken}} = getState();
        try {
            dispatch({type: REFUND_ORDER_REQUEST, payload: {refund: {amount, status: 'PENDING'}}});
            const {data: {refund}} = await refundOrder(extOrderId, amount, accessToken);
            dispatch({type: REFUND_ORDER_SUCCESS, payload: {refund}});
        } catch (error) {
            dispatch({type: REFUND_ORDER_FAILURE, payload: {error, refund: undefined}});
        }
    };
};

export const deleteOrderIfNeeded = (extOrderId) => {
    return async (dispatch, getState) => {
        const {auth: {accessToken}} = getState();
        try {
            dispatch({type: DELETE_ORDER_REQUEST, payload: {status: 'LOCAL_DELETED'}});
            const {data} = await deleteOrder(extOrderId, accessToken);
            dispatch({type: DELETE_ORDER_SUCCESS, payload: {status: data.status}});
        } catch (error) {
            dispatch({type: DELETE_ORDER_FAILURE, payload: {error}});
        }
    };
};