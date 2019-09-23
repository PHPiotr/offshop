import {
    RETRIEVE_ADMIN_ORDERS_REQUEST,
    RETRIEVE_ADMIN_ORDERS_SUCCESS,
    RETRIEVE_ADMIN_ORDERS_FAILURE,
    ON_ADMIN_ORDER,
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
        case ON_ADMIN_ORDER:
            return {
                ...state,
                data: {...state.data, [action.payload.order.id]: action.payload.order},
                ids: state.ids.indexOf(action.payload.order.id) === -1
                    ? [action.payload.order.id, ...state.ids] : state.ids,
            };
        default:
            return state;
    }
};

export default adminOrders;
