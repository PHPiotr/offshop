import {
    RETRIEVE_PRODUCT_REQUEST,
    RETRIEVE_PRODUCT_FAILURE,
    RETRIEVE_PRODUCT_SUCCESS,
    RESET_PRODUCT_DATA,
} from '../../actions/product';

export const initialState = {
    isFetching: false,
    data: {},
    id: '',
    error: {},
};

const product = (state = {
    isFetching: false,
    data: {},
    id: '',
    error: {},
}, action) => {
    switch (action.type) {
        case RETRIEVE_PRODUCT_REQUEST:
            return {
                ...state,
                isFetching: true,
                error: {},
            };
        case RETRIEVE_PRODUCT_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.payload.entities.products,
                id: action.payload.result,
            };
        case RETRIEVE_PRODUCT_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: action.payload,
            };
        case RESET_PRODUCT_DATA:
            return initialState;
        default:
            return state;
    }
};

export default product;
