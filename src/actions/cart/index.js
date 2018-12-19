export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const EMPTY_CART = 'EMPTY_CART';

export const addToCart = (item, amount = 1) => ({
    type: ADD_TO_CART,
    payload: { item, amount },
});
export const removeFromCart = (item, amount = 1) => ({
    type: REMOVE_FROM_CART,
    payload: { item, amount },
});
