export const SET_BUYER_INPUT_VALUE = 'SET_BUYER_INPUT_VALUE';

export const setBuyerInputValue = (name, value) => ({
    type: SET_BUYER_INPUT_VALUE,
    payload: {name, value},
});
