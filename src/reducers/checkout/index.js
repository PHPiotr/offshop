import {
    STEP_NEXT,
    STEP_BACK,
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILURE
} from '../../actions/checkout';

const initialState = {
    activeStep: 0,
    steps: ['Dane do wysyłki', 'Potwierdzenie zamówienia'],
    creatingOrder: false,
    orderData: null,
    orderError: null,
};

const checkout = (state = initialState, action) => {
    switch (action.type) {
        case STEP_NEXT:
            return {
                ...state,
                activeStep:
                    state.activeStep < state.steps.length
                        ? (state.activeStep += 1)
                        : state.activeStep,
            };
        case STEP_BACK:
            return {
                ...state,
                activeStep: state.activeStep
                    ? (state.activeStep -= 1)
                    : state.activeStep,
            };
        case CREATE_ORDER_REQUEST:
            return {
                ...state,
                creatingOrder: true,
                orderData: null,
                orderError: null,
            };
        case CREATE_ORDER_SUCCESS:
            return {
                ...state,
                creatingOrder: false,
                orderData: action.payload.orderData,
                orderError: null,
            };
        case CREATE_ORDER_FAILURE:
            return {
                ...state,
                creatingOrder: false,
                orderData: null,
                orderError: action.payload.orderError,
            };
        default:
            return state;
    }
};

export default checkout;
