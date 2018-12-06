export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const EMPTY_CART = 'EMPTY_CART';

export const addToCart = (productId, amount = 1) => ({type: ADD_TO_CART, payload: {productId, amount}});
export const removeFromCart = (productId, amount = 1) => ({type: REMOVE_FROM_CART, payload: {productId, amount}});
