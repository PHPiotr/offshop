import {
    RETRIEVE_ADMIN_PRODUCT_FAILURE,
    RETRIEVE_ADMIN_PRODUCT_REQUEST,
    RETRIEVE_ADMIN_PRODUCT_SUCCESS,
    RESET_ADMIN_PRODUCT,
} from '../actions/admin/product';

const initialState = {
    data: {},
    id: '',
    isFetching: false,
    isCreating: false,
    isDeleting: false,
    error: {},
};

const adminProduct = (state = initialState, action) => {
    switch (action.type) {
        case RETRIEVE_ADMIN_PRODUCT_REQUEST:
            return {...state, isFetching: true};
        case RETRIEVE_ADMIN_PRODUCT_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.payload.entities.products,
                id: action.payload.result,
            };
        case RETRIEVE_ADMIN_PRODUCT_FAILURE:
            return {...state, isFetching: false, error: action.payload};
        case RESET_ADMIN_PRODUCT:
            return initialState;
        default:
            return state;
    }
};

export default adminProduct;
