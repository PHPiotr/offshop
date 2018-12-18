export const SET_SHIPPING_INPUT_VALUE = 'SET_SHIPPING_INPUT_VALUE';

export const setShippingInputValue = (name, value) => ({type: SET_SHIPPING_INPUT_VALUE, payload: {name, value}});
