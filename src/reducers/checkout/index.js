import {
    STEP_NEXT,
    STEP_BACK,
    SET_ACTIVE_STEP_ID, TOGGLE_CREATE_ORDER_FAILED_DIALOG,
} from '../../actions/checkout';
import {BUYER_DELIVERY_REQUIRED, BUYER_DELIVERY_SKIPPED} from "../../actions/buyerDelivery";

const stepsIdsWithBuyerDeliveryRequired = [0, 1, 2];
const stepsIdsWithBuyerDeliverySkipped = [0, 2];

const initialState = {
    activeStepId: 0,
    stepsIds: stepsIdsWithBuyerDeliverySkipped,
    steps: {
        0: {
            id: 0,
            label: 'Dane kupującego',
            value: 'buyer',
        },
        1: {
            id: 1,
            label: 'Dane do wysyłki',
            value: 'buyerDelivery',
        },
        2: {
            id: 2,
            label: 'Podsumowanie',
            value: 'review',
        }
    },
    createOrderFailedDialogOpen: false,
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
        case TOGGLE_CREATE_ORDER_FAILED_DIALOG:
            return {
                ...state,
                createOrderFailedDialogOpen: !state.createOrderFailedDialogOpen,
            };
        case BUYER_DELIVERY_SKIPPED:
            return {
                ...state,
                stepsIds: stepsIdsWithBuyerDeliverySkipped,
            };
        case BUYER_DELIVERY_REQUIRED:
            return {
                ...state,
                stepsIds: stepsIdsWithBuyerDeliveryRequired,
            };
        default:
            return state;
    }
};

export default checkout;
