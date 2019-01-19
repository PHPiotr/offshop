import {
    STEP_NEXT,
    STEP_BACK,
    SET_ACTIVE_STEP, TOGGLE_CREATE_ORDER_FAILED_DIALOG,
} from '../../actions/checkout';

const initialState = {
    activeStep: 0,
    steps: ['Dane kupującego', 'Dane do wysyłki', 'Podsumowanie'],
    createOrderFailedDialogOpen: false,
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
        case SET_ACTIVE_STEP:
            return {
                ...state,
                activeStep: action.payload.activeStep,
            };
        case TOGGLE_CREATE_ORDER_FAILED_DIALOG:
            return {
                ...state,
                createOrderFailedDialogOpen: !state.createOrderFailedDialogOpen,
            };
        default:
            return state;
    }
};

export default checkout;
