import {
    RETRIEVE_PRODUCTS_REQUEST,
    RETRIEVE_PRODUCTS_SUCCESS,
    RETRIEVE_PRODUCTS_FAILURE,
    SYNC_QUANTITIES,
    ON_CREATE_PRODUCT,
    ON_UPDATE_PRODUCT,
    ON_DELETE_PRODUCT,
} from "../actions/products";
import {ON_UPDATE_PRODUCT_IN_CART} from '../actions/cart';
import {ON_UPDATE_PRODUCT_IN_CART_SUMMARY} from '../actions/checkout';

const initialState = {
    data: {},
    ids: [],
    isFetching: false,
    error: null,
};

const mergeIds = (state, payload) => {
    let mergedIds;
    if (state.ids.indexOf(payload.product.id) === -1) {
        mergedIds = [...state.ids, payload.product.id];
    } else {
        mergedIds = [...state.ids];
    }
    if (payload.product.active === false) {
        return mergedIds.filter(i => i !== payload.product.id);
    }
    const updatedData = {...state.data, [payload.product.id]: payload.product};
    return mergedIds
        .map(i => updatedData[i])
        .sort((a, b) => {
            if (payload.order === 1) {
                if (a[payload.sort] < b[payload.sort]) {
                    return -1;
                }
                if (a[payload.sort] > b[payload.sort]) {
                    return 1;
                }
            } else {
                if (a[payload.sort] > b[payload.sort]) {
                    return -1;
                }
                if (a[payload.sort] < b[payload.sort]) {
                    return 1;
                }
            }
            return 0;
        })
        .map(i => i.id);
};

const products = (state = initialState, {type, payload}) => {
    switch (type) {
        case RETRIEVE_PRODUCTS_REQUEST:
            return {...state, isFetching: true, error: null};
        case RETRIEVE_PRODUCTS_SUCCESS:
            return {
                ...state,
                data: payload.entities.products,
                ids: payload.result,
                isFetching: false,
            };
        case RETRIEVE_PRODUCTS_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: payload.error,
            };
        case SYNC_QUANTITIES:
            const newState = {...state};
            payload.productsIds.forEach(id => newState.data[id].stock = payload.productsById[id].stock);
            return newState;

        case ON_CREATE_PRODUCT:
            return {
                ...state,
                data: {...state.data, [payload.product.id]: payload.product},
                ids: mergeIds(state, payload),
            };
        case ON_UPDATE_PRODUCT_IN_CART_SUMMARY:
        case ON_UPDATE_PRODUCT_IN_CART:
        case ON_UPDATE_PRODUCT:
            return {
                ...state,
                data: {...state.data, [payload.product.id]: payload.product},
                ids: mergeIds(state, payload),
            };
        case ON_DELETE_PRODUCT:
            return {
                ...state,
                ids: [...state.ids].filter(i => i !== payload.product.id),
            };
        default:
            return state;
    }
};

export default products;
