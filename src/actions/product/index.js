export const SET_PRODUCT_INPUT_VALUE = 'SET_PRODUCT_INPUT_VALUE';

export const setProductInputValue = (name, value) => ({
    type: SET_PRODUCT_INPUT_VALUE,
    payload: {name, value},
});
