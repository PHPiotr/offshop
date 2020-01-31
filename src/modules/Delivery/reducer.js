import * as actions from './actionTypes';

const adminDeliveryMethodInitialState = {
    isDeleting: false,
    isFetching: false,
    data: {},
    id: null,
    error: {},
};

const adminDeliveryMethodsInitialState = {
    isDeleting: false,
    isFetching: false,
    data: {},
    ids: [],
    error: null,
};

export const adminDeliveryMethod = (state = adminDeliveryMethodInitialState, action) => {
    switch (action.type) {
        case actions.RETRIEVE_ADMIN_DELIVERY_METHOD_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case actions.RETRIEVE_ADMIN_DELIVERY_METHOD_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.payload.entities.deliveryMethods,
                id: action.payload.result,
            };
        case actions.RETRIEVE_ADMIN_DELIVERY_METHOD_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                isFetching: false,
            };
        case actions.RESET_DELIVERY_METHOD:
            return adminDeliveryMethodInitialState;
        default:
            return state;
    }
};

export const adminDeliveryMethods = (state = adminDeliveryMethodsInitialState, action) => {
    switch (action.type) {
        case actions.RETRIEVE_ADMIN_DELIVERY_METHODS_REQUEST:
            return {
                ...state,
                isFetching: true,
                error: null,
            };
        case actions.RETRIEVE_ADMIN_DELIVERY_METHODS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.payload.entities.deliveryMethods,
                ids: action.payload.result,
            };
        case actions.RETRIEVE_ADMIN_DELIVERY_METHODS_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                isFetching: false,
            };

        case actions.DELETE_DELIVERY_METHOD_REQUEST:
            return {
                ...state,
                isDeleting: true,
                ids: state.ids.filter(id => id !== action.payload.deliveryMethodId),
            };
        case actions.DELETE_DELIVERY_METHOD_SUCCESS:
            return {
                ...state,
                isDeleting: false,
            };
        case actions.DELETE_DELIVERY_METHOD_FAILURE:
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

const initialDeliveryMethodsState = {
    ids: [],
    data: {},
    currentId: null,
    isFetching: false,
    error: null,
};

export const deliveryMethods = (state = initialDeliveryMethodsState, {type, payload}) => {
    switch (type) {
        case actions.SET_CURRENT_DELIVERY_METHOD:
            return {
                ...state,
                currentId: payload.current.id,
            };
        case actions.RETRIEVE_DELIVERY_METHODS_REQUEST:
            return {
                ...state,
                isFetching: true,
                error: null,
            };
        case actions.RETRIEVE_DELIVERY_METHODS_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: payload.error,
            };
        case actions.RETRIEVE_DELIVERY_METHODS_SUCCESS:
            return {
                ...state,
                ids: payload.result,
                data: {...state.data, ...payload.entities.deliveryMethods},
                isFetching: false,
            };
        case actions.ON_UPDATE_DELIVERY_METHOD:
            return {
                ...state,
                data: {
                    ...state.data,
                    [payload.deliveryMethod.id]: payload.deliveryMethod,
                },
            };
        case actions.ON_CREATE_DELIVERY_METHOD:
            return {
                ...state,
                ids: [payload.deliveryMethod.id, ...state.ids],
                data: {
                    ...state.data,
                    [payload.deliveryMethod.id]: payload.deliveryMethod,
                },
            };
        case actions.ON_DELETE_DELIVERY_METHOD:
            return {
                ...state,
                ids: state.ids.filter(id => id !== payload.deliveryMethod.id),
                data: {
                    ...state.data,
                    [payload.deliveryMethod.id]: undefined,
                },
                currentId: payload.deliveryMethod.id === state.currentId ? null : state.currentId,
            };
        default:
            return state;
    }
};
