import {
    RETRIEVE_ADMIN_ORDER_REQUEST,
    RETRIEVE_ADMIN_ORDER_SUCCESS,
    RETRIEVE_ADMIN_ORDER_FAILURE,
    CANCEL_ORDER_REQUEST,
    CANCEL_ORDER_SUCCESS,
    CANCEL_ORDER_FAILURE,
} from '../../actions/admin/order';

const initialState = {
    isFetching: false,
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
        default:
            return state;
    }
};

export default adminOrder;