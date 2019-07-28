import {
    RETRIEVE_ADMIN_ORDER_REQUEST,
    RETRIEVE_ADMIN_ORDER_SUCCESS,
    RETRIEVE_ADMIN_ORDER_FAILURE,
} from '../../actions/admin/order';

const initialState = {
    isDeleting: false,
    isFetching: false,
    data: {},
    id: null,
    error: {},
};

const adminOrder = (state = initialState, action) => {
    switch (action.type) {
        case RETRIEVE_ADMIN_ORDER_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case RETRIEVE_ADMIN_ORDER_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.payload.entities.orders,
                id: action.payload.result,
            };
        case RETRIEVE_ADMIN_ORDER_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                isFetching: false,
            };
        default:
            return state;
    }
};

export default adminOrder;