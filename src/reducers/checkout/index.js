import {
    STEP_NEXT,
    STEP_BACK,
    SET_ACTIVE_STEP_ID,
} from '../../actions/checkout';
import {SET_CURRENT_DELIVERY_METHOD} from "../../actions/deliveryMethods";

const stepsIdsWithBuyerDeliveryRequired = [0, 1, 2];
const stepsIdsWithBuyerDeliverySkipped = [0, 2];

const initialState = {
    activeStepId: 0,
    stepsIds: [],
    steps: {
        0: {
            id: 0,
            label: 'Klient',
            value: 'buyer',
        },
        1: {
            id: 1,
            label: 'Adres',
            value: 'buyerDelivery',
        },
        2: {
            id: 2,
            label: 'Płatność',
            value: 'review',
        }
    },
};

const checkout = (state = initialState, action) => {
    switch (action.type) {
        case STEP_NEXT:
            return {
                ...state,
                activeStepId: state.activeStep === state.stepsIds[state.stepsIds.length - 1]
                    ? state.activeStep
                    : state.stepsIds[state.stepsIds.indexOf(state.activeStepId) + 1],
            };
        case STEP_BACK:
            return {
                ...state,
                activeStepId: state.activeStep === state.stepsIds[0]
                    ? state.activeStep
                    : state.stepsIds[state.stepsIds.indexOf(state.activeStepId) - 1],
            };
        case SET_ACTIVE_STEP_ID:
            return {
                ...state,
                activeStepId: action.payload.activeStepId,
            };
        case SET_CURRENT_DELIVERY_METHOD:
            return {
                ...state,
                stepsIds: action.payload.current.unitPrice > 0 ? stepsIdsWithBuyerDeliveryRequired : stepsIdsWithBuyerDeliverySkipped,
            };
        default:
            return state;
    }
};

export default checkout;
