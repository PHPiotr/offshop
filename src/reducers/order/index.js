import {
    RETRIEVE_ORDER_FAILURE,
    RETRIEVE_ORDER_REQUEST,
    RETRIEVE_ORDER_SUCCESS,
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILURE
} from "../../actions/order";

const initialState = {
    retrievingOrder: false,
    creatingOrder: false,
    data: null,
    error: null,
};

const order = (state = initialState, action) => {
    switch (action.type) {
        case RETRIEVE_ORDER_REQUEST:
            return {
                ...state,
                retrievingOrder: true,
                data: null,
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
                  ...state,
                  retrievingOrder: false,
                  data: null,
                  error: action.payload.orderError,
              };
        case CREATE_ORDER_REQUEST:
            return {
                ...state,
                creatingOrder: true,
                data: null,
                error: null,
            };
        case CREATE_ORDER_SUCCESS:
            return {
                ...state,
                creatingOrder: false,
                data: action.payload.orderData,
                error: null,
            };
        case CREATE_ORDER_FAILURE:
            return {
                ...state,
                creatingOrder: false,
                data: null,
                error: action.payload.orderError,
            };
        default:
            return state;
    }
};

export default order;
