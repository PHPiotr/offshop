import * as actions from './actionTypes';
import {SET_CURRENT_DELIVERY_METHOD} from '../../modules/Delivery/actionTypes';

const stepsIdsWithBuyerDeliveryRequired = [0, 1, 2];
const stepsIdsWithBuyerDeliverySkipped = [0, 2];

const initialState = {
    activeStepId: 0,
    stepsIds: [],
};

export const checkout = (state = initialState, action) => {
    switch (action.type) {
        case actions.STEP_NEXT:
            return {
                ...state,
                activeStepId: state.stepsIds[state.stepsIds.indexOf(state.activeStepId) + 1],
            };
        case actions.STEP_BACK:
            return {
                ...state,
                activeStepId: state.stepsIds[state.stepsIds.indexOf(state.activeStepId) - 1],
            };
        case actions.SET_ACTIVE_STEP_ID:
            return {
                ...state,
                activeStepId: action.payload.activeStepId,
            };
        case SET_CURRENT_DELIVERY_METHOD:
            return {
                ...state,
                stepsIds: action.payload.current.unitPrice > 0 ? stepsIdsWithBuyerDeliveryRequired : stepsIdsWithBuyerDeliverySkipped,
                activeStepId: 0,
            };
        default:
            return state;
    }
};
