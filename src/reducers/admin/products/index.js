import {
    DELETE_PRODUCT_FAILURE,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS, RETRIEVE_ADMIN_PRODUCTS_FAILURE,
    RETRIEVE_ADMIN_PRODUCTS_REQUEST, RETRIEVE_ADMIN_PRODUCTS_SUCCESS
} from '../../../actions/admin/products';

const initialState = {
    isDeleting: false,
    isFetching: false,
    data: {},
    ids: [],
    error: {},
};

const adminProducts = (state = initialState, action) => {
    switch (action.type) {
        case RETRIEVE_ADMIN_PRODUCTS_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case RETRIEVE_ADMIN_PRODUCTS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.payload.entities.products,
                ids: action.payload.result,
            };
        case RETRIEVE_ADMIN_PRODUCTS_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                isFetching: false,
            };

        case DELETE_PRODUCT_REQUEST:
            return {
                ...state,
                isDeleting: true,
                ids: state.ids.filter(id => id !== action.payload.productId),
            };
        case DELETE_PRODUCT_SUCCESS:
            return {
                ...state,
                isDeleting: false,
            };
        case DELETE_PRODUCT_FAILURE:
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

export default adminProducts;