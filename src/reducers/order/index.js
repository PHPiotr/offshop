import {
    RETRIEVE_ORDER_FAILURE,
    RETRIEVE_ORDER_REQUEST,
    RETRIEVE_ORDER_SUCCESS,
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILURE,
    RESET_ORDER_DATA,
    RESET_IS_CREATED,

} from '../../actions/order';

export const initialState = {
    retrievingOrder: false,
    isCreating: false,
    isDoneCreating: false,
    data: {},
    error: '',
    errorDialogOpen: false,
};

const order = (state = initialState, action) => {
    switch (action.type) {
        case RETRIEVE_ORDER_REQUEST:
            return {
                ...state,
                retrievingOrder: true,
                error: null,
            };
        case RETRIEVE_ORDER_SUCCESS:
              return {
                  ...state,
                  retrievingOrder: false,
                  data: action.payload.orderData,
                  error: null,
              };
        case RETRIEVE_ORDER_FAILURE:
              return {
                  ...initialState,
                  error: action.payload.orderError,
              };
        case CREATE_ORDER_REQUEST:
            return {
                ...state,
                isCreating: true,
                error: null,
            };
        case CREATE_ORDER_SUCCESS:
            return {
                ...state,
                isCreating: false,
                data: action.payload.orderData,
                error: null,
                isDoneCreating: true,
            };
        case CREATE_ORDER_FAILURE:
            return {
                ...state,
                error: action.payload.orderError,
                isDoneCreating: true,
            };
        case RESET_ORDER_DATA:
            return {
                ...initialState,
            };
        case RESET_IS_CREATED:
            return {
                ...state,
                isDoneCreating: false,
            };
        default:
            return state;
    }
};

export default order;
