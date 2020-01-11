import * as actions from './actionTypes';

export const addToCart = (item, quantity = 1) => ({
    type: actions.ADD_TO_CART,
    payload: {item, quantity},
});

export const decrementInCart = (item, quantity = 1) => ({
    type: actions.DECREMENT_IN_CART,
    payload: {item, quantity},
});

export const deleteFromCart = itemId => ({
    type: actions.DELETE_FROM_CART,
    payload: {itemId},
});

export const onUpdateProductInCart = product => ({
    type: actions.ON_UPDATE_PRODUCT_IN_CART,
    payload: {product},
});

export const onDeleteProductInCart = product => ({
    type: actions.ON_DELETE_PRODUCT_IN_CART,
    payload: {itemId: product.id},
});
