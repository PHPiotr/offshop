import {ADD_TO_CART, REMOVE_FROM_CART} from '../../actions/cart';
import {RETRIEVE_PRODUCTS_REQUEST, RETRIEVE_PRODUCTS_SUCCESS, RETRIEVE_PRODUCTS_FAILURE} from "../../actions/products";
import {combineReducers} from "redux";
import {CREATE_ORDER_SUCCESS} from "../../actions/order";

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
        case ADD_TO_CART:
            return {
                ...state,
                [payload.item._id]: {
                    ...state[payload.item._id],
                    quantity: (state[payload.item._id].quantity -= payload.quantity),
                    inCart: (state[payload.item._id].inCart += payload.quantity),
                },
            };
        case REMOVE_FROM_CART:
            return {
                ...state,
                [payload.item._id]: {
                    ...state[payload.item._id],
                    quantity: (state[payload.item._id].quantity += payload.quantity),
                    inCart: (state[payload.item._id].inCart -= payload.quantity),
                },
            };
        case CREATE_ORDER_SUCCESS:
            const newState = {...state};
            payload.orderData.productsIds.forEach(_id => newState[_id] = {...newState[_id], inCart: 0});
            return newState;
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
