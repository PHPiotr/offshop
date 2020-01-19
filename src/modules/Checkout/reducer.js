import {combineReducers} from "redux";
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
                activeStepId: state.activeStep === state.stepsIds[state.stepsIds.length - 1]
                    ? state.activeStep
                    : state.stepsIds[state.stepsIds.indexOf(state.activeStepId) + 1],
            };
        case actions.STEP_BACK:
            return {
                ...state,
                activeStepId: state.activeStep === state.stepsIds[0]
                    ? state.activeStep
                    : state.stepsIds[state.stepsIds.indexOf(state.activeStepId) - 1],
            };
        case actions.SET_ACTIVE_STEP_ID:
            return {
                ...state,
                activeStepId: action.payload.activeStepId,
            };
        case SET_CURRENT_DELIVERY_METHOD:
            let withDelivery = action.payload.current.unitPrice > 0;
            return {
                ...state,
                stepsIds: withDelivery ? stepsIdsWithBuyerDeliveryRequired : stepsIdsWithBuyerDeliverySkipped,
                activeStepId: withDelivery ? (state.activeStepId === 2 ? 1 : state.activeStepId) : (state.activeStepId === 1 ? 2 : state.activeStepId),
            };
        default:
            return state;
    }
};