import {normalize} from 'normalizr';
import * as schema from '../../schemas/ordersSchema';
import {getAdminOrders} from '../../api/orders';

export const RETRIEVE_ADMIN_ORDERS_REQUEST = 'RETRIEVE_ADMIN_ORDERS_REQUEST';
export const RETRIEVE_ADMIN_ORDERS_SUCCESS = 'RETRIEVE_ADMIN_ORDERS_SUCCESS';
export const RETRIEVE_ADMIN_ORDERS_FAILURE = 'RETRIEVE_ADMIN_ORDERS_FAILURE';

export const getAdminOrdersIfNeeded = (params = {}) => {
    return async (dispatch, getState) => {
        const {adminOrders: {isFetching}, auth: {accessToken}} = getState();
        if (isFetching) {
            return Promise.resolve();
        }

        dispatch({type: RETRIEVE_ADMIN_ORDERS_REQUEST});
        try {
            const {data} = await getAdminOrders(params, accessToken);
            const payload = normalize(data, schema.orderList);
            dispatch({type: RETRIEVE_ADMIN_ORDERS_SUCCESS, payload});
        } catch (error) {
            dispatch({type: RETRIEVE_ADMIN_ORDERS_FAILURE, payload: {error}});
        }
    };
};
