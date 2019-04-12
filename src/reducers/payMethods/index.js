import {combineReducers} from 'redux';
import * as actions from '../../actions/payMethods';

const initialIds = [];
const initialData = {};
const initialIsFetching = false;


const ids = (state = initialIds, {type, payload}) => {
    switch(type) {
        case actions.RETRIEVE_PAY_METHODS_SUCCESS:
            return payload.result;
        default:
            return state;
    }
};

const data = (state = initialData, {type, payload}) => {
    switch(type) {
        case actions.RETRIEVE_PAY_METHODS_SUCCESS:
            return {
                ...state,
                ...payload.entities.payMethods,
            };
        default:
            return state;
    }
};

const isFetching = (state = initialIsFetching, {type}) => {
    switch (type) {
        case actions.RETRIEVE_PAY_METHODS_REQUEST:
            return true;
        case actions.RETRIEVE_PAY_METHODS_SUCCESS:
        case actions.RETRIEVE_PAY_METHODS_FAILURE:
            return false;
        default:
            return state;
    }
};


const payMethods = combineReducers({
    ids,
    data,
    isFetching,
});

export default payMethods;