import {normalize} from 'normalizr';
import {getOrder} from '../../api/orders';
import * as orderSchema from '../../schemas/ordersSchema';

export const RETRIEVE_ADMIN_ORDER_REQUEST = 'RETRIEVE_ADMIN_ORDER_REQUEST';
export const RETRIEVE_ADMIN_ORDER_SUCCESS = 'RETRIEVE_ADMIN_ORDER_SUCCESS';
export const RETRIEVE_ADMIN_ORDER_FAILURE = 'RETRIEVE_ADMIN_ORDER_FAILURE';

// export const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST';
// export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS';
// export const CREATE_ORDER_FAILURE = 'CREATE_ORDER_FAILURE';
//
// export const UPDATE_ORDER_REQUEST = 'UPDATE_ORDER_REQUEST';
// export const UPDATE_ORDER_SUCCESS = 'UPDATE_ORDER_SUCCESS';
// export const UPDATE_ORDER_FAILURE = 'UPDATE_ORDER_FAILURE';

// export const createOrderIfNeeded = (formProps, accessToken) => async dispatch => {
//     dispatch({type: CREATE_ORDER_REQUEST});
//     try {
//         const {data} = await createOrder({...formProps, unitPrice: formProps.unitPrice * 1000 / 10}, accessToken);
//         const payload = normalize(data, deliveryMethodSchema.deliveryMethod);
//         dispatch({type: CREATE_ORDER_SUCCESS, payload});
//         return payload;
//     } catch (error) {
//         dispatch({type: CREATE_ORDER_FAILURE});
//         return error;
//     }
// };

// export const updateOrderIfNeeded = (formProps, accessToken) => async (dispatch, getState) => {
//
//     const {adminOrder: {id}} = getState();
//
//     dispatch({type: UPDATE_ORDER_REQUEST});
//     try {
//         const {data} = await updateOrder(id, {...formProps, unitPrice: formProps.unitPrice * 1000 / 10}, accessToken);
//         const payload = normalize(data, deliveryMethodSchema.deliveryMethod);
//         dispatch({type: UPDATE_ORDER_SUCCESS, payload});
//         return payload;
//     } catch (error) {
//         dispatch({type: UPDATE_ORDER_FAILURE});
//         return error;
//     }
// };

export const getAdminOrderIfNeeded = extOrderId => {
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