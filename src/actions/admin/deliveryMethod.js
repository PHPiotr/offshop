import {normalize} from 'normalizr';
import {createDeliveryMethod, getAdminDeliveryMethod, updateDeliveryMethod} from '../../api/deliveryMethods';
import * as deliveryMethodSchema from '../../schemas/deliveryMethodsSchema';

export const RETRIEVE_ADMIN_DELIVERY_METHOD_REQUEST = 'RETRIEVE_ADMIN_DELIVERY_METHOD_REQUEST';
export const RETRIEVE_ADMIN_DELIVERY_METHOD_SUCCESS = 'RETRIEVE_ADMIN_DELIVERY_METHOD_SUCCESS';
export const RETRIEVE_ADMIN_DELIVERY_METHOD_FAILURE = 'RETRIEVE_ADMIN_DELIVERY_METHOD_FAILURE';

export const CREATE_DELIVERY_METHOD_REQUEST = 'CREATE_DELIVERY_METHOD_REQUEST';
export const CREATE_DELIVERY_METHOD_SUCCESS = 'CREATE_DELIVERY_METHOD_SUCCESS';
export const CREATE_DELIVERY_METHOD_FAILURE = 'CREATE_DELIVERY_METHOD_FAILURE';

export const UPDATE_DELIVERY_METHOD_REQUEST = 'UPDATE_DELIVERY_METHOD_REQUEST';
export const UPDATE_DELIVERY_METHOD_SUCCESS = 'UPDATE_DELIVERY_METHOD_SUCCESS';
export const UPDATE_DELIVERY_METHOD_FAILURE = 'UPDATE_DELIVERY_METHOD_FAILURE';

export const RESET_DELIVERY_METHOD = 'RESET_DELIVERY_METHOD';

export const createDeliveryMethodIfNeeded = (formProps, accessToken) => async dispatch => {
    dispatch({type: CREATE_DELIVERY_METHOD_REQUEST});
    try {
        const {data} = await createDeliveryMethod({...formProps, unitPrice: formProps.unitPrice * 1000 / 10}, accessToken);
        const payload = normalize(data, deliveryMethodSchema.deliveryMethod);
        dispatch({type: CREATE_DELIVERY_METHOD_SUCCESS, payload});
        return payload;
    } catch (error) {
        dispatch({type: CREATE_DELIVERY_METHOD_FAILURE});
        return error;
    }
};

export const updateDeliveryMethodIfNeeded = (formProps, accessToken) => async (dispatch, getState) => {

    const {adminDeliveryMethod: {id}} = getState();

    dispatch({type: UPDATE_DELIVERY_METHOD_REQUEST});
    try {
        const {data} = await updateDeliveryMethod(id, {...formProps, unitPrice: formProps.unitPrice * 1000 / 10}, accessToken);
        const payload = normalize(data, deliveryMethodSchema.deliveryMethod);
        dispatch({type: UPDATE_DELIVERY_METHOD_SUCCESS, payload});
        return payload;
    } catch (error) {
        dispatch({type: UPDATE_DELIVERY_METHOD_FAILURE});
        return error;
    }
};

export const getAdminDeliveryMethodIfNeeded = deliveryMethodId => {
    return async (dispatch, getState) => {
        const {adminDeliveryMethods: {isFetching}, auth: {accessToken}} = getState();
        if (isFetching) {
            return;
        }

        dispatch({type: RETRIEVE_ADMIN_DELIVERY_METHOD_REQUEST});
        try {
            const {data} = await getAdminDeliveryMethod(deliveryMethodId, accessToken);
            const payload = normalize(data, deliveryMethodSchema.deliveryMethod);
            dispatch({type: RETRIEVE_ADMIN_DELIVERY_METHOD_SUCCESS, payload});

            return payload;
        } catch (error) {
            dispatch({type: RETRIEVE_ADMIN_DELIVERY_METHOD_FAILURE, payload: {error}});

            return error;
        }
    };
};

export const resetDeliveryMethod = () => ({type: RESET_DELIVERY_METHOD});
