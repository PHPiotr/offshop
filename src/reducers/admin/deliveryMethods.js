import {
    DELETE_DELIVERY_METHOD_FAILURE,
    DELETE_DELIVERY_METHOD_REQUEST,
    DELETE_DELIVERY_METHOD_SUCCESS, RETRIEVE_ADMIN_DELIVERY_METHODS_FAILURE,
    RETRIEVE_ADMIN_DELIVERY_METHODS_REQUEST, RETRIEVE_ADMIN_DELIVERY_METHODS_SUCCESS
} from '../../actions/admin/deliveryMethods';

const initialState = {
    isDeleting: false,
    isFetching: false,
    data: {},
    ids: [],
    error: {},
};

const adminDeliveryMethods = (state = initialState, action) => {
    switch (action.type) {
        case RETRIEVE_ADMIN_DELIVERY_METHODS_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case RETRIEVE_ADMIN_DELIVERY_METHODS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.payload.entities.deliveryMethods,
                ids: action.payload.result,
            };
        case RETRIEVE_ADMIN_DELIVERY_METHODS_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                isFetching: false,
            };

        case DELETE_DELIVERY_METHOD_REQUEST:
            return {
                ...state,
                isDeleting: true,
                ids: state.ids.filter(id => id !== action.payload.deliveryMethodId),
            };
        case DELETE_DELIVERY_METHOD_SUCCESS:
            return {
                ...state,
                isDeleting: false,
            };
        case DELETE_DELIVERY_METHOD_FAILURE:
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

export default adminDeliveryMethods;