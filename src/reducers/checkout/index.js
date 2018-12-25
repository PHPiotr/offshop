import {
    STEP_NEXT,
    STEP_BACK,
    SET_ACTIVE_STEP,
} from '../../actions/checkout';

const initialState = {
    activeStep: 0,
    steps: ['Dane do wysyłki', 'Potwierdzenie zamówienia'],
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
        default:
            return state;
    }
};

export default checkout;
