import * as actions from './actionTypes';

const orderInitialState = {
    isFetching: false,
    isRefunding: false,
    data: {},
    id: null,
    error: {},
};

const ordersInitialState = {
    isFetching: false,
    data: {},
    ids: [],
    error: {},
};

export const adminOrders = (state = ordersInitialState, action) => {
    switch (action.type) {
        case actions.RETRIEVE_ADMIN_ORDERS_REQUEST:
            return {
                ...state,
                isFetching: true,
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
        case actions.ON_ADMIN_ORDER:
            return {
                ...state,
                data: {...state.data, [action.payload.order.id]: action.payload.order},
                ids: state.ids.indexOf(action.payload.order.id) === -1
                    ? [action.payload.order.id, ...state.ids] : state.ids,
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
        case actions.CANCEL_ORDER_REQUEST:
            return {
                ...state,
                data: {...state.data, [state.id]: {...state.data[state.id], status: action.payload.status}},
                error: {},
            };
        case actions.CANCEL_ORDER_FAILURE:
            return {
                ...state,
                data: {...state.data, [state.id]: {...state.data[state.id], status: action.payload.status}},
                error: action.payload.error,
            };
        case actions.CANCEL_ORDER_SUCCESS:
            return {
                ...state,
                data: {...state.data, [state.id]: {...state.data[state.id], status: action.payload.status}},
            };
        case actions.RETRIEVE_ADMIN_ORDER_REQUEST:
            return {
                ...state,
                isFetching: true,
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
            return {
                ...state,
                isRefunding: true,
                data: {...state.data, [state.id]: {...state.data[state.id], refund: action.payload.refund}},
            };
        case actions.ON_ADMIN_REFUND:
            return {
                ...state,
                data: {...state.data, [state.id]: action.payload.order},
            };
        case actions.REFUND_ORDER_SUCCESS:
            return {
                ...state,
                isRefunding: false,
                data: {...state.data, [state.id]: {...state.data[state.id], refund: action.payload.refund}},
            };
        case actions.REFUND_ORDER_FAILURE:
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

const initialOrderState = {
    retrievingOrder: false,
    isCreating: false,
    data: {},
    error: '',
    errorDialogOpen: false,
};

export const order = (state = initialOrderState, action) => {
    switch (action.type) {
        case actions.RETRIEVE_ORDER_REQUEST:
            return {
                ...state,
                retrievingOrder: true,
                error: null,
            };
        case actions.RETRIEVE_ORDER_SUCCESS:
            return {
                ...state,
                retrievingOrder: false,
                data: action.payload.orderData,
                error: null,
            };
        case actions.RETRIEVE_ORDER_FAILURE:
            return {
                ...initialOrderState,
                error: action.payload.orderError,
            };
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
                error: null,
            };
        case actions.CREATE_ORDER_FAILURE:
            return {
                ...state,
                error: action.payload.orderError,
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
