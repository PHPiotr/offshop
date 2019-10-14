import {normalize} from 'normalizr';
import * as schema from '../../schemas/ordersSchema';
import {getAdminOrders} from '../../api/orders';

export const RETRIEVE_ADMIN_ORDERS_REQUEST = 'RETRIEVE_ADMIN_ORDERS_REQUEST';
export const RETRIEVE_ADMIN_ORDERS_SUCCESS = 'RETRIEVE_ADMIN_ORDERS_SUCCESS';
export const RETRIEVE_ADMIN_ORDERS_FAILURE = 'RETRIEVE_ADMIN_ORDERS_FAILURE';
export const ON_ADMIN_ORDER = 'ON_ADMIN_ORDER';

export const getAdminOrdersIfNeeded = (params = {}) => {
    return async (dispatch, getState) => {
        const {adminOrders: {isFetching, data, ids}, auth: {accessToken}} = getState();
        if (isFetching) {
            return Promise.resolve();
        }

        dispatch({type: RETRIEVE_ADMIN_ORDERS_REQUEST});
        try {
            const response = await getAdminOrders(params, accessToken);
            const payload = normalize(response.data, schema.orderList);
            if (params.skip > 0) {
                dispatch({
                    type: RETRIEVE_ADMIN_ORDERS_SUCCESS,
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
                dispatch({type: RETRIEVE_ADMIN_ORDERS_SUCCESS, payload});
            }
            return payload;
        } catch (error) {
            dispatch({type: RETRIEVE_ADMIN_ORDERS_FAILURE, payload: {error}});
            return error;
        }
    };
};

export const onAdminOrder = order => ({type: ON_ADMIN_ORDER, payload: {order}});
