import * as actions from './actionTypes';
import {CREATE_ORDER_SUCCESS} from '../Checkout/actionTypes';
import {combineReducers} from 'redux';

const deliveryMethodInitialState = {
    isDeleting: false,
    isFetching: false,
    data: {},
    id: null,
    error: {},
};

const deliveryMethodsInitialState = {
    isDeleting: false,
    isFetching: false,
    data: {},
    ids: [],
    error: {},
};

export const adminDeliveryMethod = (state = deliveryMethodInitialState, action) => {
    switch (action.type) {
        case actions.RETRIEVE_ADMIN_DELIVERY_METHOD_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case actions.RETRIEVE_ADMIN_DELIVERY_METHOD_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.payload.entities.deliveryMethods,
                id: action.payload.result,
            };
        case actions.RETRIEVE_ADMIN_DELIVERY_METHOD_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                isFetching: false,
            };
        case actions.RESET_DELIVERY_METHOD:
            return deliveryMethodInitialState;
        default:
            return state;
    }
};

export const adminDeliveryMethods = (state = deliveryMethodsInitialState, action) => {
    switch (action.type) {
        case actions.RETRIEVE_ADMIN_DELIVERY_METHODS_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case actions.RETRIEVE_ADMIN_DELIVERY_METHODS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.payload.entities.deliveryMethods,
                ids: action.payload.result,
            };
        case actions.RETRIEVE_ADMIN_DELIVERY_METHODS_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                isFetching: false,
            };

        case actions.DELETE_DELIVERY_METHOD_REQUEST:
            return {
                ...state,
                isDeleting: true,
                ids: state.ids.filter(id => id !== action.payload.deliveryMethodId),
            };
        case actions.DELETE_DELIVERY_METHOD_SUCCESS:
            return {
                ...state,
                isDeleting: false,
            };
        case actions.DELETE_DELIVERY_METHOD_FAILURE:
            return {
                ...state,
                isDeleting: false,
                ids: action.payload.ids,
                error: action.payload.error,
            };
        default:
            return state;
    }
};


const initialIds = [];
const initialData = {};
const initialCurrentId = null;
const initialIsFetching = false;

const ids = (state = initialIds, {type, payload}) => {
    switch(type) {
        case actions.RETRIEVE_DELIVERY_METHODS_SUCCESS:
            return payload.result;
        case actions.ON_CREATE_DELIVERY_METHOD:
            return [payload.deliveryMethod.id, ...state];
        case CREATE_ORDER_SUCCESS:
            return [...initialIds];
        default:
            return state;
    }
};

const data = (state = initialData, {type, payload}) => {
    switch(type) {
        case actions.RETRIEVE_DELIVERY_METHODS_SUCCESS:
            return {
                ...state,
                ...payload.entities.deliveryMethods,
            };
        case actions.SYNC_DELIVERY_METHODS:
            const newState = {...state};
            payload.deliveryMethodsIds.forEach(id => newState[id].quantity = payload.productsById[id].quantity);
            return newState;
        case actions.ON_CREATE_DELIVERY_METHOD:
            state[payload.deliveryMethod.id] = payload.deliveryMethod;
            return state;
        case CREATE_ORDER_SUCCESS:
            return {...initialData};
        default:
            return state;
    }
};

const currentId = (state = initialCurrentId, {type, payload}) => {
    switch (type) {
        case actions.SET_CURRENT_DELIVERY_METHOD:
            return payload.current.id;
        case CREATE_ORDER_SUCCESS:
            return initialCurrentId;
        default:
            return state;
    }
};

const isFetching = (state = initialIsFetching, {type, payload}) => {
    switch (type) {
        case actions.RETRIEVE_DELIVERY_METHODS_REQUEST:
            return true;
        case actions.RETRIEVE_DELIVERY_METHODS_SUCCESS:
        case actions.RETRIEVE_DELIVERY_METHODS_FAILURE:
            return false;
        default:
            return state;
    }
};

export const deliveryMethods = combineReducers({
    ids,
    data,
    currentId,
    isFetching,
});
