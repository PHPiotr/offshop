export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';

export const addToCart = (item, quantity = 1) => ({
    type: ADD_TO_CART,
    payload: { item, quantity },
});
export const removeFromCart = (item, quantity = 1) => ({
    type: REMOVE_FROM_CART,
    payload: { item, quantity },
});
