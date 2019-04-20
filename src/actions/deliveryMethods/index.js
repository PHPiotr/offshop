import {normalize} from 'normalizr';
import * as deliveryMethodsSchema from '../../schemas/deliveryMethodsSchema';
import {getDeliveryMethods} from "../../api/deliveryMethods";

export const RETRIEVE_DELIVERY_METHODS_REQUEST = 'RETRIEVE_DELIVERY_METHODS_REQUEST';
export const RETRIEVE_DELIVERY_METHODS_SUCCESS = 'RETRIEVE_DELIVERY_METHODS_SUCCESS';
export const RETRIEVE_DELIVERY_METHODS_FAILURE = 'RETRIEVE_DELIVERY_METHODS_FAILURE';
export const SET_CURRENT_DELIVERY_METHOD= 'SET_CURRENT_DELIVERY_METHOD';
export const SYNC_DELIVERY_METHODS = 'SYNC_DELIVERY_METHODS';
export const ON_CREATE_DELIVERY_METHOD = 'ON_CREATE_DELIVERY_METHOD';

export const setCurrentDeliveryMethod = current => ({
    type: SET_CURRENT_DELIVERY_METHOD,
    payload: { current },
});

export const getDeliveryMethodsIfNeeded = params => {
    return async (dispatch, getState) => {
        const {deliveryMethods: {isFetching}} = getState();
        if (isFetching) {
            Promise.resolve();
        }

        dispatch({type: RETRIEVE_DELIVERY_METHODS_REQUEST});
        try {
            const {data} = await getDeliveryMethods();
            const payload = normalize(data, deliveryMethodsSchema.deliveryMethodList);
            dispatch({type: RETRIEVE_DELIVERY_METHODS_SUCCESS, payload});

            return Promise.resolve(payload);
        } catch (error) {
            dispatch({type: RETRIEVE_DELIVERY_METHODS_FAILURE, payload: {error}});
            return Promise.reject(error);
        }
    };
};

export const sync = (deliveryMethodsIds, deliveryMethodsById) => ({type: SYNC_DELIVERY_METHODS, payload: {deliveryMethodsIds, deliveryMethodsById}});
export const onCreateDeliveryMethod = (deliveryMethod) => ({type: ON_CREATE_DELIVERY_METHOD, payload: {deliveryMethod}});
