import {normalize} from 'normalizr';
import * as deliveryMethodSchema from '../../modules/ShoppingCart/schema';
import * as actions from './actionTypes';
import {
    deleteRequestPrivate,
    getRequestPrivate,
    getRequestPublic,
    postRequestPrivate,
    putRequestPrivate
} from '../../api';
import * as deliveryMethodsSchema from '../ShoppingCart/schema';

export const setCurrentDeliveryMethod = current => ({
    type: actions.SET_CURRENT_DELIVERY_METHOD,
    payload: {current},
});

export const getDeliveryMethodsIfNeeded = params => {
    return async dispatch => {
        dispatch({type: actions.RETRIEVE_DELIVERY_METHODS_REQUEST});
        try {
            const {data} = await getRequestPublic('delivery-methods', params);
            const payload = normalize(data, deliveryMethodsSchema.deliveryMethodList);
            dispatch({type: actions.RETRIEVE_DELIVERY_METHODS_SUCCESS, payload});
            return payload;
        } catch (error) {
            dispatch({type: actions.RETRIEVE_DELIVERY_METHODS_FAILURE, payload: {error}});
        }
    };
};

export const onCreateDeliveryMethod = deliveryMethod => ({
    type: actions.ON_CREATE_DELIVERY_METHOD,
    payload: {deliveryMethod},
});
export const onUpdateDeliveryMethod = deliveryMethod => ({
    type: actions.ON_UPDATE_DELIVERY_METHOD,
    payload: {deliveryMethod},
});
export const onDeleteDeliveryMethod = deliveryMethod => ({
    type: actions.ON_DELETE_DELIVERY_METHOD,
    payload: {deliveryMethod},
});

export const createDeliveryMethodIfNeeded = (formProps, accessToken) => async dispatch => {
    dispatch({type: actions.CREATE_DELIVERY_METHOD_REQUEST});
    try {
        const {data} = await postRequestPrivate(accessToken)('/admin/delivery-methods', {}, {...formProps, unitPrice: formProps.unitPrice * 1000 / 10});
        const payload = normalize(data, deliveryMethodSchema.deliveryMethod);
        dispatch({type: actions.CREATE_DELIVERY_METHOD_SUCCESS, payload});
    } catch (error) {
        dispatch({type: actions.CREATE_DELIVERY_METHOD_FAILURE, payload: {error}});
        throw error;
    }
};

export const updateDeliveryMethodIfNeeded = (formProps, accessToken) => async (dispatch, getState) => {
    const {adminDeliveryMethod: {id}} = getState();
    dispatch({type: actions.UPDATE_DELIVERY_METHOD_REQUEST});
    try {
        const {data} = await putRequestPrivate(accessToken)(`/admin/delivery-methods/${id}`, {}, {...formProps, unitPrice: formProps.unitPrice * 1000 / 10});
        const payload = normalize(data, deliveryMethodSchema.deliveryMethod);
        dispatch({type: actions.UPDATE_DELIVERY_METHOD_SUCCESS, payload});
    } catch (error) {
        dispatch({type: actions.UPDATE_DELIVERY_METHOD_FAILURE, payload: {error}});
        throw error;
    }
};

export const getAdminDeliveryMethodIfNeeded = deliveryMethodId => {
    return async (dispatch, getState) => {
        const {auth: {accessToken}} = getState();
        dispatch({type: actions.RETRIEVE_ADMIN_DELIVERY_METHOD_REQUEST});
        try {
            const response = await getRequestPrivate(accessToken)(`/admin/delivery-methods/${deliveryMethodId}`);
            const {data} = response;
            const payload = normalize(data, deliveryMethodSchema.deliveryMethod);
            dispatch({type: actions.RETRIEVE_ADMIN_DELIVERY_METHOD_SUCCESS, payload});
        } catch (error) {
            dispatch({type: actions.RETRIEVE_ADMIN_DELIVERY_METHOD_FAILURE, payload: {error}});
            throw error;
        }
    };
};

export const resetDeliveryMethod = () => ({type: actions.RESET_DELIVERY_METHOD});

export const getAdminDeliveryMethodsIfNeeded = (params = {}) => {
    return async (dispatch, getState) => {
        const {auth: {accessToken}} = getState();
        dispatch({type: actions.RETRIEVE_ADMIN_DELIVERY_METHODS_REQUEST});
        try {
            const {data} = await getRequestPrivate(accessToken)('/admin/delivery-methods', params);
            const payload = normalize(data, deliveryMethodSchema.deliveryMethodList);
            dispatch({type: actions.RETRIEVE_ADMIN_DELIVERY_METHODS_SUCCESS, payload});
            return payload;
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
            await deleteRequestPrivate(accessToken)(`/admin/delivery-methods/${deliveryMethodId}`);
            dispatch({type: actions.DELETE_DELIVERY_METHOD_SUCCESS});
        } catch (error) {
            dispatch({type: actions.DELETE_DELIVERY_METHOD_FAILURE, payload: {error, ids}});
            throw error;
        }
    };
};
