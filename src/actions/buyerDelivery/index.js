export const SET_BUYER_DELIVERY_INPUT_VALUE = 'SET_BUYER_DELIVERY_INPUT_VALUE';

export const setBuyerDeliveryInputValue = (name, value) => ({
    type: SET_BUYER_DELIVERY_INPUT_VALUE,
    payload: {name, value},
});
