import {
    RETRIEVE_PRODUCTS_REQUEST,
    RETRIEVE_PRODUCTS_SUCCESS,
    RETRIEVE_PRODUCTS_FAILURE,
    SYNC_QUANTITIES,
    ON_CREATE_PRODUCT,
} from "../../actions/products";
import {combineReducers} from "redux";

const initialData = {};
const initialIds = [];
const initialIsFetching = false;
const initialError = null;

const ids = (state = initialIds, {type, payload}) => {
    switch(type) {
        case RETRIEVE_PRODUCTS_SUCCESS:
            return [
                ...state,
                ...payload.result,
            ];
        case ON_CREATE_PRODUCT:
            return [payload.product._id, ...state];
        default:
            return state;
    }
};

const data = (state = initialData, {type, payload}) => {
    switch(type) {
        case RETRIEVE_PRODUCTS_SUCCESS:
            return {
                ...state,
                ...payload.entities.products,
            };
        case SYNC_QUANTITIES:
            const newState = {...state};
            payload.productsIds.forEach(id => newState[id].quantity = payload.productsById[id].quantity);
            return newState;
        case ON_CREATE_PRODUCT:
            state[payload.product._id] = payload.product;
            return state;
        default:
            return state;
    }
};

const error = (state = initialError, {type, payload}) => {
    switch(type) {
        case RETRIEVE_PRODUCTS_REQUEST:
        case RETRIEVE_PRODUCTS_SUCCESS:
            return null;
        case RETRIEVE_PRODUCTS_FAILURE:
            return payload.error;
        default:
            return state;
    }
};

const products = combineReducers({
    ids,
    data,
    isFetching: (state = initialIsFetching, {type}) => (type === RETRIEVE_PRODUCTS_REQUEST),
    error,
});

export default products;
