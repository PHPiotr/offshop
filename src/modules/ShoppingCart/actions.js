import * as actions from './actionTypes';
import {ON_DELETE_PRODUCT, ON_UPDATE_PRODUCT} from '../Products/actionTypes';

export const addToCart = (item, quantity = 1) => ({
    type: actions.ADD_TO_CART,
    payload: {item, quantity},
});

export const decrementInCart = (item, quantity = 1) => ({
    type: actions.DECREMENT_IN_CART,
    payload: {item, quantity},
});

export const deleteFromCart = product => ({
    type: actions.DELETE_FROM_CART,
    payload: {product},
});

export const onUpdateProductInCart = product => ({
    type: ON_UPDATE_PRODUCT,
    payload: {product},
});

export const onDeleteProductInCart = product => ({
    type: ON_DELETE_PRODUCT,
    payload: {product},
});
