export const ADD_TO_CART = 'ADD_TO_CART';
export const DECREMENT_IN_CART = 'DECREMENT_IN_CART';
export const DELETE_FROM_CART = 'DELETE_FROM_CART';
export const ON_UPDATE_PRODUCT_IN_CART = 'ON_UPDATE_PRODUCT_IN_CART';
export const ON_DELETE_PRODUCT_IN_CART = 'ON_DELETE_PRODUCT_IN_CART';

export const addToCart = (item, quantity = 1) => ({
    type: ADD_TO_CART,
    payload: { item, quantity },
});
export const decrementInCart = (item, quantity = 1) => ({
    type: DECREMENT_IN_CART,
    payload: { item, quantity },
});
export const deleteFromCart = itemId => ({
    type: DELETE_FROM_CART,
    payload: { itemId },
});
export const onUpdateProductInCart = product => ({type: ON_UPDATE_PRODUCT_IN_CART, payload: {product}});
export const onDeleteProductInCart = product => ({type: ON_DELETE_PRODUCT_IN_CART, payload: {itemId: product.id}});
