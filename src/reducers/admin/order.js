import {
    RETRIEVE_ADMIN_ORDER_REQUEST,
    RETRIEVE_ADMIN_ORDER_SUCCESS,
    RETRIEVE_ADMIN_ORDER_FAILURE,
    CANCEL_ORDER_REQUEST,
    CANCEL_ORDER_SUCCESS,
    CANCEL_ORDER_FAILURE,
    REFUND_ORDER_REQUEST,
    REFUND_ORDER_SUCCESS,
    REFUND_ORDER_FAILURE,
    ON_ADMIN_REFUND,
} from '../../actions/admin/order';

const initialState = {
    isFetching: false,
    isRefunding: false,
    data: {},
    id: null,
    error: {},
};

const adminOrder = (state = initialState, action) => {
    switch (action.type) {
        case CANCEL_ORDER_REQUEST:
            return {
                ...state,
                data: {...state.data, [state.id]: {...state.data[state.id], status: action.payload.status}},
                error: {},
            };
        case CANCEL_ORDER_FAILURE:
            return {
                ...state,
                data: {...state.data, [state.id]: {...state.data[state.id], status: action.payload.status}},
                error: action.payload.error,
            };
        case CANCEL_ORDER_SUCCESS:
            return {
                ...state,
                data: {...state.data, [state.id]: {...state.data[state.id], status: action.payload.status}},
            };
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
        case REFUND_ORDER_REQUEST:
            return {
                ...state,
                isRefunding: true,
                data: {...state.data, [state.id]: {...state.data[state.id], refund: action.payload.refund}},
            };
        case ON_ADMIN_REFUND:
        case REFUND_ORDER_SUCCESS:
            return {
                ...state,
                isRefunding: false,
                data: {...state.data, [state.id]: {...state.data[state.id], refund: action.payload.refund}},
            };
        case REFUND_ORDER_FAILURE:
            return {
                ...state,
                isRefunding: false,
                error: action.payload.error,
                data: {...state.data, [state.id]: {...state.data[state.id], refund: undefined}},
            };
        default:
            return state;
    }
};

export default adminOrder;