import {normalize} from 'normalizr';
import * as deliveryMethodSchema from '../../schemas/deliveryMethodsSchema';
import {deleteDeliveryMethod, getAdminDeliveryMethods} from '../../api/deliveryMethods';

export const RETRIEVE_ADMIN_DELIVERY_METHODS_REQUEST = 'RETRIEVE_ADMIN_DELIVERY_METHODS_REQUEST';
export const RETRIEVE_ADMIN_DELIVERY_METHODS_SUCCESS = 'RETRIEVE_ADMIN_DELIVERY_METHODS_SUCCESS';
export const RETRIEVE_ADMIN_DELIVERY_METHODS_FAILURE = 'RETRIEVE_ADMIN_DELIVERY_METHODS_FAILURE';

export const DELETE_DELIVERY_METHOD_REQUEST = 'DELETE_DELIVERY_METHOD_REQUEST';
export const DELETE_DELIVERY_METHOD_SUCCESS = 'DELETE_DELIVERY_METHOD_SUCCESS';
export const DELETE_DELIVERY_METHOD_FAILURE = 'DELETE_DELIVERY_METHOD_FAILURE';

export const getAdminDeliveryMethodsIfNeeded = (params = {}) => {
    return async (dispatch, getState) => {
        const {adminDeliveryMethods: {isFetching}, auth: {accessToken}} = getState();
        if (isFetching) {
            return Promise.resolve();
        }

        dispatch({type: RETRIEVE_ADMIN_DELIVERY_METHODS_REQUEST});
        try {
            const {data} = await getAdminDeliveryMethods(params, accessToken);
            const payload = normalize(data, deliveryMethodSchema.deliveryMethodList);
            dispatch({type: RETRIEVE_ADMIN_DELIVERY_METHODS_SUCCESS, payload});
        } catch (error) {
            dispatch({type: RETRIEVE_ADMIN_DELIVERY_METHODS_FAILURE, payload: {error}});
        }
    };
};

export const deleteDeliveryMethodIfNeeded = deliveryMethodId => {
    return async (dispatch, getState) => {
        const {auth: {accessToken}, adminDeliveryMethods: {ids}} = getState();
        try {
            dispatch({type: DELETE_DELIVERY_METHOD_REQUEST, payload: {deliveryMethodId}});

            await deleteDeliveryMethod(deliveryMethodId, accessToken);

            dispatch({type: DELETE_DELIVERY_METHOD_SUCCESS});

            return Promise.resolve(deliveryMethodId);
        } catch (error) {
            dispatch({type: DELETE_DELIVERY_METHOD_FAILURE, payload: {error, ids}});

            return Promise.reject(error);
        }
    };
};