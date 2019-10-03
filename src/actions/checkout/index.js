export const STEP_NEXT = 'STEP_NEXT';
export const STEP_BACK = 'STEP_BACK';
export const SET_ACTIVE_STEP_ID = 'SET_ACTIVE_STEP_ID';
export const ON_UPDATE_PRODUCT_IN_CART_SUMMARY = 'ON_UPDATE_PRODUCT_IN_CART_SUMMARY';
export const ON_DELETE_PRODUCT_IN_CART_SUMMARY = 'ON_DELETE_PRODUCT_IN_CART_SUMMARY';

export const stepNext = () => ({ type: STEP_NEXT });
export const stepBack = () => ({ type: STEP_BACK });
export const setActiveStepId = activeStepId => ({ type: SET_ACTIVE_STEP_ID, payload: {activeStepId} });
export const onUpdateProductInCartSummary = product => ({ type: ON_UPDATE_PRODUCT_IN_CART_SUMMARY, payload: {product} });
export const onDeleteProductInCartSummary = product => ({ type: ON_DELETE_PRODUCT_IN_CART_SUMMARY, payload: {product} });
