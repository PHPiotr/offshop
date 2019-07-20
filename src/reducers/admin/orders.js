import {
    RETRIEVE_ADMIN_ORDERS_REQUEST,
    RETRIEVE_ADMIN_ORDERS_SUCCESS,
    RETRIEVE_ADMIN_ORDERS_FAILURE,
    DELETE_ORDERS_FAILURE,
    DELETE_ORDERS_REQUEST,
    DELETE_ORDERS_SUCCESS,
} from '../../actions/admin/orders';

const initialState = {
    isFetching: false,
    data: {},
    ids: [],
    error: {},
};

const adminOrders = (state = initialState, action) => {
    switch (action.type) {
        case RETRIEVE_ADMIN_ORDERS_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case RETRIEVE_ADMIN_ORDERS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.payload.entities.orders,
                ids: action.payload.result,
            };
        case RETRIEVE_ADMIN_ORDERS_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                isFetching: false,
            };
        case DELETE_ORDERS_REQUEST:
            return {
                ...state,
                isDeleting: true,
                ids: state.ids.filter(id => id !== action.payload.deliveryMethodId),
            };
        case DELETE_ORDERS_SUCCESS:
            return {
                ...state,
                isDeleting: false,
            };
        case DELETE_ORDERS_FAILURE:
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

export default adminOrders;
