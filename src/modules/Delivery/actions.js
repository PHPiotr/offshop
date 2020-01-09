import {normalize} from 'normalizr';
import * as deliveryMethodSchema from '../../modules/ShoppingCart/schema';
import {
    createDeliveryMethod,
    deleteDeliveryMethod, getAdminDeliveryMethod,
    getAdminDeliveryMethods,
    updateDeliveryMethod
} from './api';
import * as actions from './actionTypes';
import {getRequestPublic} from '../../api';
import * as deliveryMethodsSchema from '../ShoppingCart/schema';

export const setCurrentDeliveryMethod = current => ({
    type: actions.SET_CURRENT_DELIVERY_METHOD,
    payload: {current},
});

export const getDeliveryMethodsIfNeeded = params => {
    return async (dispatch, getState) => {
        const {deliveryMethods: {isFetching}} = getState();
        if (isFetching) {
            return Promise.resolve();
        }
        dispatch({type: actions.RETRIEVE_DELIVERY_METHODS_REQUEST});
        try {
            const {data} = await getRequestPublic('delivery-methods', params);
            const payload = normalize(data, deliveryMethodsSchema.deliveryMethodList);
            dispatch({type: actions.RETRIEVE_DELIVERY_METHODS_SUCCESS, payload});

            return Promise.resolve(payload);
        } catch (error) {
            dispatch({type: actions.RETRIEVE_DELIVERY_METHODS_FAILURE, payload: {error}});
            return Promise.reject(error);
        }
    };
};

export const sync = (deliveryMethodsIds, deliveryMethodsById) => ({
    type: actions.SYNC_DELIVERY_METHODS,
    payload: {deliveryMethodsIds, deliveryMethodsById},
});

export const onCreateDeliveryMethod = (deliveryMethod) => ({
    type: actions.ON_CREATE_DELIVERY_METHOD,
    payload: {deliveryMethod},
});

export const createDeliveryMethodIfNeeded = (formProps, accessToken) => async dispatch => {
    dispatch({type: actions.CREATE_DELIVERY_METHOD_REQUEST});
    try {
        const response = await createDeliveryMethod({...formProps, unitPrice: formProps.unitPrice * 1000 / 10}, accessToken);
        const {status, data} = response;
        if (status === 201) {
            const payload = normalize(data, deliveryMethodSchema.deliveryMethod);
            dispatch({type: actions.CREATE_DELIVERY_METHOD_SUCCESS, payload});
        } else {
            dispatch({type: actions.CREATE_DELIVERY_METHOD_FAILURE, payload: {error: data}});
        }
        return response;
    } catch (error) {
        dispatch({type: actions.CREATE_DELIVERY_METHOD_FAILURE, payload: {error}});
        return error;
    }
};

export const updateDeliveryMethodIfNeeded = (formProps, accessToken) => async (dispatch, getState) => {

    const {adminDeliveryMethod: {id}} = getState();

    dispatch({type: actions.UPDATE_DELIVERY_METHOD_REQUEST});
    try {
        const response = await updateDeliveryMethod(id, {...formProps, unitPrice: formProps.unitPrice * 1000 / 10}, accessToken);
        const {status, data} = response;
        if (status === 200) {
            const payload = normalize(data, deliveryMethodSchema.deliveryMethod);
            dispatch({type: actions.UPDATE_DELIVERY_METHOD_SUCCESS, payload});
        } else {
            dispatch({type: actions.UPDATE_DELIVERY_METHOD_FAILURE, payload: {error: data}});
        }
        return response;
    } catch (error) {
        dispatch({type: actions.UPDATE_DELIVERY_METHOD_FAILURE, payload: {error}});
        return error;
    }
};

export const getAdminDeliveryMethodIfNeeded = deliveryMethodId => {
    return async (dispatch, getState) => {
        const {adminDeliveryMethods: {isFetching}, auth: {accessToken}} = getState();
        if (isFetching) {
            return;
        }

        dispatch({type: actions.RETRIEVE_ADMIN_DELIVERY_METHOD_REQUEST});
        try {
            const response = await getAdminDeliveryMethod(deliveryMethodId, accessToken);
            const {data} = response;
            const payload = normalize(data, deliveryMethodSchema.deliveryMethod);
            dispatch({type: actions.RETRIEVE_ADMIN_DELIVERY_METHOD_SUCCESS, payload});

            return response;
        } catch (error) {
            dispatch({type: actions.RETRIEVE_ADMIN_DELIVERY_METHOD_FAILURE, payload: {error}});

            return error.response;
        }
    };
};

export const resetDeliveryMethod = () => ({type: actions.RESET_DELIVERY_METHOD});

export const getAdminDeliveryMethodsIfNeeded = (params = {}) => {
    return async (dispatch, getState) => {
        const {adminDeliveryMethods: {isFetching}, auth: {accessToken}} = getState();
        if (isFetching) {
            return Promise.resolve();
        }

        dispatch({type: actions.RETRIEVE_ADMIN_DELIVERY_METHODS_REQUEST});
        try {
            const {data} = await getAdminDeliveryMethods(params, accessToken);
            const payload = normalize(data, deliveryMethodSchema.deliveryMethodList);
            dispatch({type: actions.RETRIEVE_ADMIN_DELIVERY_METHODS_SUCCESS, payload});
        } catch (error) {
            dispatch({type: actions.RETRIEVE_ADMIN_DELIVERY_METHODS_FAILURE, payload: {error}});
        }
    };
};

export const deleteDeliveryMethodIfNeeded = deliveryMethodId => {
    return async (dispatch, getState) => {
        const {auth: {accessToken}, adminDeliveryMethods: {ids}} = getState();
        try {
            dispatch({type: actions.DELETE_DELIVERY_METHOD_REQUEST, payload: {deliveryMethodId}});

            await deleteDeliveryMethod(deliveryMethodId, accessToken);

            dispatch({type: actions.DELETE_DELIVERY_METHOD_SUCCESS});

            return Promise.resolve(deliveryMethodId);
        } catch (error) {
            dispatch({type: actions.DELETE_DELIVERY_METHOD_FAILURE, payload: {error, ids}});

            return Promise.reject(error);
        }
    };
};