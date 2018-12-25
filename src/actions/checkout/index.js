export const STEP_NEXT = 'STEP_NEXT';
export const STEP_BACK = 'STEP_BACK';
export const SET_ACTIVE_STEP = 'SET_ACTIVE_STEP';

export const stepNext = () => ({ type: STEP_NEXT });
export const stepBack = () => ({ type: STEP_BACK });
export const setActiveStep = activeStep => ({ type: SET_ACTIVE_STEP, payload: {activeStep} });
