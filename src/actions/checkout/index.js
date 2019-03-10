export const STEP_NEXT = 'STEP_NEXT';
export const STEP_BACK = 'STEP_BACK';
export const SET_ACTIVE_STEP_ID = 'SET_ACTIVE_STEP_ID';

export const stepNext = () => ({ type: STEP_NEXT });
export const stepBack = () => ({ type: STEP_BACK });
export const setActiveStepId = activeStepId => ({ type: SET_ACTIVE_STEP_ID, payload: {activeStepId} });
