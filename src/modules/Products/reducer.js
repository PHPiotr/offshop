import * as actions from "./actionTypes";

const initialProductState = {
    isFetching: false,
    data: {},
    id: '',
    error: {},
};

const initialProductsState = {
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
            if (payload.order === '1') {
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

export const product = (state = initialProductState, action) => {
    switch (action.type) {
        case actions.ON_UPDATE_CURRENT_PRODUCT:
            return {
                ...state,
                data: action.payload.product.active ? {[action.payload.product.id]: action.payload.product} : {},
                id: action.payload.product.active ? action.payload.product.id : '',
            };
        case actions.ON_DELETE_CURRENT_PRODUCT:
            return {
                ...state,
                data: {},
                id: '',
            };
        case actions.RETRIEVE_PRODUCT_REQUEST:
            return {
                ...state,
                isFetching: true,
                error: {},
            };
        case actions.RETRIEVE_PRODUCT_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.payload.entities.products,
                id: action.payload.result,
            };
        case actions.RETRIEVE_PRODUCT_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const products = (state = initialProductsState, {type, payload}) => {
    switch (type) {
        case actions.RETRIEVE_PRODUCTS_REQUEST:
            return {...state, isFetching: true, error: null};
        case actions.RETRIEVE_PRODUCTS_SUCCESS:
            return {
                ...state,
                data: payload.entities.products,
                ids: payload.result,
                isFetching: false,
            };
        case actions.RETRIEVE_PRODUCTS_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: payload.error,
            };
        case actions.ON_CREATE_PRODUCT:
            return {
                ...state,
                data: {...state.data, [payload.product.id]: payload.product},
                ids: mergeIds(state, payload),
            };
        case actions.ON_UPDATE_PRODUCT:
            return {
                ...state,
                data: {...state.data, [payload.product.id]: payload.product},
                ids: mergeIds(state, payload),
            };
        case actions.ON_DELETE_PRODUCT:
            return {
                ...state,
                ids: [...state.ids].filter(i => i !== payload.product.id),
            };
        default:
            return state;
    }
};

const initialAdminProductState = {
    data: {},
    id: '',
    isFetching: false,
    isCreating: false,
    isDeleting: false,
    error: {},
};

export const adminProduct = (state = initialAdminProductState, action) => {
    switch (action.type) {
        case actions.RETRIEVE_ADMIN_PRODUCT_REQUEST:
            return {...state, isFetching: true};
        case actions.RETRIEVE_ADMIN_PRODUCT_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.payload.entities.products,
                id: action.payload.result,
            };
        case actions.RETRIEVE_ADMIN_PRODUCT_FAILURE:
            return {...state, isFetching: false, error: action.payload};
        case actions.RESET_ADMIN_PRODUCT:
            return initialAdminProductState;
        default:
            return state;
    }
};

const initialAdminProductsState = {
    isDeleting: false,
    isFetching: false,
    data: {},
    ids: [],
    error: null,
};

export const adminProducts = (state = initialAdminProductsState, action) => {
    switch (action.type) {
        case actions.RETRIEVE_ADMIN_PRODUCTS_REQUEST:
            return {
                ...state,
                isFetching: true,
                error: null,
            };
        case actions.RETRIEVE_ADMIN_PRODUCTS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.payload.entities.products,
                ids: action.payload.result,
            };
        case actions.RETRIEVE_ADMIN_PRODUCTS_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                isFetching: false,
            };

        case actions.DELETE_PRODUCT_REQUEST:
            return {
                ...state,
                isDeleting: true,
                ids: state.ids.filter(id => id !== action.payload.productId),
            };
        case actions.DELETE_PRODUCT_SUCCESS:
            return {
                ...state,
                isDeleting: false,
            };
        case actions.DELETE_PRODUCT_FAILURE:
            return {
                ...state,
                isDeleting: false,
                ids: action.payload.ids,
            };
        default:
            return state;
    }
};
