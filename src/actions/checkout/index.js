export const STEP_NEXT = 'STEP_NEXT';
export const STEP_BACK = 'STEP_BACK';
export const SET_ACTIVE_STEP_ID = 'SET_ACTIVE_STEP_ID';
export const TOGGLE_CREATE_ORDER_FAILED_DIALOG = 'TOGGLE_CREATE_ORDER_FAILED_DIALOG';

export const stepNext = () => ({ type: STEP_NEXT });
export const stepBack = () => ({ type: STEP_BACK });
export const setActiveStepId = activeStepId => ({ type: SET_ACTIVE_STEP_ID, payload: {activeStepId} });
export const toggleCreateOrderFailedDialog = () => ({type: TOGGLE_CREATE_ORDER_FAILED_DIALOG});
