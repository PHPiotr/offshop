import {STEP_NEXT, STEP_BACK} from "../../actions/checkout";

const initialState = {
    activeStep: 0,
    steps: ['Adres do wysyłki', 'Szczegóły płatności', 'Potwierdzenie zamówienia'],
};

const checkout = (state = initialState, action) => {
    switch (action.type) {
        case STEP_NEXT:
            return {...state, activeStep: state.activeStep < state.steps.length ? state.activeStep += 1 : state.activeStep};
        case STEP_BACK:
            return {...state, activeStep: state.activeStep ? state.activeStep -= 1 : state.activeStep};
        default:
            return state;
    }
};

export default checkout;
