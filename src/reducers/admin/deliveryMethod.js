import {
    RETRIEVE_ADMIN_DELIVERY_METHOD_REQUEST,
    RETRIEVE_ADMIN_DELIVERY_METHOD_SUCCESS,
    RETRIEVE_ADMIN_DELIVERY_METHOD_FAILURE,
    RESET_DELIVERY_METHOD,
} from '../../actions/admin/deliveryMethod';

const initialState = {
    isDeleting: false,
    isFetching: false,
    data: {},
    id: null,
    error: {},
};

const adminDeliveryMethods = (state = initialState, action) => {
    switch (action.type) {
        case RETRIEVE_ADMIN_DELIVERY_METHOD_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case RETRIEVE_ADMIN_DELIVERY_METHOD_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.payload.entities.deliveryMethods,
                id: action.payload.result,
            };
        case RETRIEVE_ADMIN_DELIVERY_METHOD_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                isFetching: false,
            };
        case RESET_DELIVERY_METHOD:
            return initialState;
        default:
            return state;
    }
};

export default adminDeliveryMethods;