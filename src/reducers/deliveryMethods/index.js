import * as actions from '../../actions/deliveryMethods';
import {combineReducers} from 'redux';

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
        default:
            return state;
    }
};

const currentId = (state = initialCurrentId, {type, payload}) => {
    switch (type) {
        case actions.SET_CURRENT_DELIVERY_METHOD:
            return payload.current.id;
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
