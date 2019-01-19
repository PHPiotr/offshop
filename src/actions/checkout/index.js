export const STEP_NEXT = 'STEP_NEXT';
export const STEP_BACK = 'STEP_BACK';
export const SET_ACTIVE_STEP = 'SET_ACTIVE_STEP';
export const TOGGLE_CREATE_ORDER_FAILED_DIALOG = 'TOGGLE_CREATE_ORDER_FAILED_DIALOG';

export const stepNext = () => ({ type: STEP_NEXT });
export const stepBack = () => ({ type: STEP_BACK });
export const setActiveStep = activeStep => ({ type: SET_ACTIVE_STEP, payload: {activeStep} });
export const toggleCreateOrderFailedDialog = () => ({type: TOGGLE_CREATE_ORDER_FAILED_DIALOG});
