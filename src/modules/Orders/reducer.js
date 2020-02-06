import * as actions from './actionTypes';

const orderInitialState = {
    isDeleting: false,
    isFetching: false,
    data: {},
    id: null,
    error: {},
};

const ordersInitialState = {
    isFetching: false,
    data: {},
    ids: [],
    error: null,
};

export const adminOrders = (state = ordersInitialState, action) => {
    switch (action.type) {
        case actions.RETRIEVE_ADMIN_ORDERS_REQUEST:
            return {
                ...state,
                isFetching: true,
                error: null,
            };
        case actions.RETRIEVE_ADMIN_ORDERS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.payload.entities.orders,
                ids: action.payload.result,
            };
        case actions.RETRIEVE_ADMIN_ORDERS_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                isFetching: false,
            };
        case actions.ON_ADMIN_CREATE_ORDER:
            return {
                ...state,
                data: {...state.data, [action.payload.order.id]: action.payload.order},
                ids: [action.payload.order.id, ...state.ids],
            };
        case actions.ON_ADMIN_UPDATE_ORDER:
            return {
                ...state,
                data: {...state.data, [action.payload.order.id]: action.payload.order},
            };
        case actions.ON_ADMIN_REFUND:
            return {
                ...state,
                data: {...state.data, [action.payload.order.id]: action.payload.order},
            };
        default:
            return state;
    }
};

export const adminOrder = (state = orderInitialState, action) => {
    switch (action.type) {
        case actions.DELETE_ORDER_REQUEST:
            return {
                ...state,
                isDeleting: true,
            };
        case actions.DELETE_ORDER_FAILURE:
            return {
                ...state,
                isDeleting: false,
            };
        case actions.DELETE_ORDER_SUCCESS:
            return {
                ...state,
                isDeleting: false,
                data: {},
                id: null,
            };
        case actions.CANCEL_ORDER_REQUEST:
        case actions.CANCEL_ORDER_FAILURE:
        case actions.CANCEL_ORDER_SUCCESS:
            return {
                ...state,
                data: {...state.data, [state.id]: {...state.data[state.id], status: action.payload.status}},
            };
        case actions.RETRIEVE_ADMIN_ORDER_REQUEST:
            return {
                ...state,
                isFetching: true,
                error: null,
            };
        case actions.RETRIEVE_ADMIN_ORDER_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.payload.entities.orders,
                id: action.payload.result,
            };
        case actions.RETRIEVE_ADMIN_ORDER_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                isFetching: false,
            };
        case actions.REFUND_ORDER_REQUEST:
        case actions.REFUND_ORDER_SUCCESS:
        case actions.REFUND_ORDER_FAILURE:
            return {
                ...state,
                data: {...state.data, [state.id]: {...state.data[state.id], refund: action.payload.refund}},
            };
        case actions.ON_ADMIN_REFUND:
            return {
                ...state,
                data: {...state.data, [state.id]: action.payload.order},
            };
        default:
            return state;
    }
};

export default adminOrder;

const initialOrderState = {
    retrievingOrder: false,
    isCreating: false,
    data: {},
    error: '',
    errorDialogOpen: false,
};

export const order = (state = initialOrderState, action) => {
    switch (action.type) {
        case actions.CREATE_ORDER_REQUEST:
            return {
                ...state,
                isCreating: true,
                error: null,
            };
        case actions.CREATE_ORDER_SUCCESS:
            return {
                ...state,
                isCreating: false,
                data: action.payload.orderData,
            };
        case actions.CREATE_ORDER_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                isCreating: false,
            };
        case actions.RESET_ORDER_DATA:
            return {
                ...initialOrderState,
            };
        default:
            return state;
    }
};
