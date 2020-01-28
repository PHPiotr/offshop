import {normalize} from 'normalizr';
import * as schema from './schema';
import {cancelOrder, deleteOrder, getAdminOrders, getOrder, refundOrder} from './api';
import * as actions from './actionTypes';

export const getAdminOrdersIfNeeded = (params = {}) => {
    return async (dispatch, getState) => {
        const {adminOrders: {data, ids}, auth: {accessToken}} = getState();
        dispatch({type: actions.RETRIEVE_ADMIN_ORDERS_REQUEST});
        try {
            const response = await getAdminOrders(params, accessToken);
            const payload = normalize(response.data, schema.orderList);
            if (params.skip > 0) {
                dispatch({
                    type: actions.RETRIEVE_ADMIN_ORDERS_SUCCESS,
                    payload: {
                        entities: {
                            orders: {
                                ...data,
                                ...payload.entities.orders,
                            }
                        },
                        result: [...ids, ...payload.result],
                    },
                });
            } else {
                dispatch({type: actions.RETRIEVE_ADMIN_ORDERS_SUCCESS, payload});
            }
            return payload;
        } catch (error) {
            dispatch({type: actions.RETRIEVE_ADMIN_ORDERS_FAILURE, payload: {error}});
        }
    };
};

export const onAdminOrder = order => ({type: actions.ON_ADMIN_ORDER, payload: {order}});

export const getOrderIfNeeded = extOrderId => {
    return async (dispatch, getState) => {
        const {auth: {accessToken}} = getState();
        dispatch({type: actions.RETRIEVE_ADMIN_ORDER_REQUEST});
        try {
            const response = await getOrder(extOrderId, accessToken);
            const {data} = response;
            const payload = normalize(data, schema.order);
            dispatch({type:  actions.RETRIEVE_ADMIN_ORDER_SUCCESS, payload});

            return response;
        } catch (error) {
            dispatch({type: actions.RETRIEVE_ADMIN_ORDER_FAILURE, payload: {error}});

            return error.response;
        }
    };
};

export const cancelOrderIfNeeded = (extOrderId, status) => {
    return async (dispatch, getState) => {
        const {auth: {accessToken}} = getState();
        try {
            dispatch({type: actions.CANCEL_ORDER_REQUEST, payload: {status: 'CANCELED'}});
            const {data} = await cancelOrder(extOrderId, accessToken);
            dispatch({type: actions.CANCEL_ORDER_SUCCESS, payload: {status: data.status}});
        } catch (error) {
            dispatch({type: actions.CANCEL_ORDER_FAILURE, payload: {status, error}});
        }
    };
};

export const refundOrderIfNeeded = (extOrderId, amount) => {
    return async (dispatch, getState) => {
        const {auth: {accessToken}} = getState();
        try {
            dispatch({type: actions.REFUND_ORDER_REQUEST, payload: {refund: {amount, status: 'PENDING'}}});
            const {data} = await refundOrder(extOrderId, amount, accessToken);
            dispatch({type: actions.REFUND_ORDER_SUCCESS, payload: {refund: data}});
        } catch (error) {
            dispatch({type: actions.REFUND_ORDER_FAILURE, payload: {error, refund: undefined}});
        }
    };
};

export const deleteOrderIfNeeded = (extOrderId) => {
    return async (dispatch, getState) => {
        const {auth: {accessToken}} = getState();
        try {
            dispatch({type: actions.DELETE_ORDER_REQUEST});
            const {data} = await deleteOrder(extOrderId, accessToken);
            dispatch({type: actions.DELETE_ORDER_SUCCESS, payload: {status: data.status}});
        } catch (error) {
            dispatch({type: actions.DELETE_ORDER_FAILURE, payload: {error}});
        }
    };
};

export const onAdminRefund = order => ({type: actions.ON_ADMIN_REFUND, payload: {order}});

export const resetOrderData = () => ({type: actions.RESET_ORDER_DATA});
