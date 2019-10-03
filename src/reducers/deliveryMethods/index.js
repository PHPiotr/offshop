import * as actions from '../../actions/deliveryMethods';
import {combineReducers} from 'redux';
import {CREATE_ORDER_SUCCESS} from '../../actions/order';

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

const deliveryMethods = combineReducers({
    ids,
    data,
    currentId,
    isFetching,
});

export default deliveryMethods;
