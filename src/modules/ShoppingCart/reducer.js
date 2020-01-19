import * as actions from './actionTypes';
import {ON_DELETE_PRODUCT, ON_UPDATE_PRODUCT, SYNC_QUANTITIES} from '../../modules/Products/actionTypes';
import {
    ON_DELETE_DELIVERY_METHOD,
    ON_UPDATE_DELIVERY_METHOD,
    SET_CURRENT_DELIVERY_METHOD
} from '../Delivery/actionTypes';
import {CREATE_ORDER_SUCCESS} from '../Orders/actionTypes';

const initialCartState = {
    quantity: 0,
    weight: 0,
    totalPrice: 0,
    ids: [],
    products: {},
    deliveryId: null,
    deliveryUnitPrice: 0,
    deliveryTotalPrice: 0,
    totalPriceWithDelivery: 0,
};

export const cart = (state = initialCartState, { payload, type }) => {
    let item;
    switch (type) {
        case ON_UPDATE_PRODUCT:
            item = state.products[payload.product.id];
            if (type === ON_UPDATE_PRODUCT && item === undefined) {
                return state;
            }
            if (!payload.product.active) {
                const {quantity, weight, totalPrice} = item;
                return {
                    ...state,
                    quantity: state.quantity - quantity,
                    weight: state.weight - weight,
                    totalPrice: state.totalPrice - totalPrice,
                    ids: state.ids.filter(id => id !== payload.product.id),
                    products: {...state.products, [payload.product.id]: undefined},
                    deliveryTotalPrice: Math.round(state.deliveryUnitPrice * (state.weight - weight) / 100),
                    totalPriceWithDelivery: Math.round((state.totalPrice - totalPrice) + (state.deliveryUnitPrice * (state.weight - weight) / 100)),
                };
            }

            let itemQuantity = Number(item.quantity);
            let payloadItemQuantity = Number(payload.product.stock);
            if (payloadItemQuantity < itemQuantity) {
                itemQuantity = payloadItemQuantity;
            }
            let totalWeight = state.weight;
            if (item.weight !== payload.product.weight * itemQuantity) {
                totalWeight = state.weight - item.weight + (payload.product.weight * itemQuantity)
            }
            let priceTotal = state.totalPrice - item.totalPrice + (payload.product.unitPrice * itemQuantity);

            return {
                ...state,
                quantity: Number(state.quantity) - Number(item.quantity) + itemQuantity,
                weight: totalWeight,
                totalPrice: priceTotal,
                products: {...state.products, [payload.product.id]: Number(payload.product.stock) > 0 ? {
                        quantity: itemQuantity,
                        weight: payload.product.weight * itemQuantity,
                        totalPrice: payload.product.unitPrice * itemQuantity,
                    } : undefined},
                ids: Number(payload.product.stock) > 0 ? state.ids : state.ids.filter(id => id !== payload.product.id),
                deliveryTotalPrice: Math.round(state.deliveryUnitPrice * (totalWeight + payload.product.weight * itemQuantity) / 100),
                totalPriceWithDelivery: Math.round(priceTotal + (state.deliveryUnitPrice * totalWeight) / 100),
            };
        case ON_DELETE_DELIVERY_METHOD:
            if (payload.deliveryMethod.id !== state.deliveryId) {
                return state;
            }
            return {
                ...state,
                deliveryId: null,
                deliveryUnitPrice: 0,
                deliveryTotalPrice: 0,
                totalPriceWithDelivery: state.totalPrice,
            };
        case ON_UPDATE_DELIVERY_METHOD:
            if (payload.deliveryMethod.id !== state.deliveryId) {
                return state;
            }
            return {
                ...state,
                deliveryUnitPrice: payload.deliveryMethod.unitPrice,
                deliveryTotalPrice: Math.round(payload.deliveryMethod.unitPrice * state.weight / 100),
                totalPriceWithDelivery: Math.round(state.totalPrice + payload.deliveryMethod.unitPrice * state.weight / 100),
            };
        case SET_CURRENT_DELIVERY_METHOD:
            return {
                ...state,
                deliveryId: payload.current.id,
                deliveryUnitPrice: payload.current.unitPrice,
                deliveryTotalPrice: Math.round(payload.current.unitPrice * state.weight / 100),
                totalPriceWithDelivery: Math.round(state.totalPrice + payload.current.unitPrice * state.weight / 100),
            };
        case actions.ADD_TO_CART:

            item = state.products[payload.item.id] || {
                quantity: 0,
                weight: 0,
                totalPrice: 0,
            };

            return {
                ...state,
                quantity: state.quantity + payload.quantity,
                weight: state.weight + payload.item.weight * payload.quantity,
                totalPrice: state.totalPrice + payload.item.unitPrice * payload.quantity,
                ids: state.ids.find(i => i === payload.item.id) ? state.ids : [...state.ids, payload.item.id],
                products: {...state.products, [payload.item.id]: {
                        quantity: item.quantity + 1,
                        weight: item.weight + payload.item.weight * payload.quantity,
                        totalPrice: item.totalPrice + payload.item.unitPrice * payload.quantity,
                    }},
                deliveryTotalPrice: Math.round(state.deliveryUnitPrice * (state.weight + payload.item.weight * payload.quantity) / 100),
                totalPriceWithDelivery: Math.round((state.totalPrice + payload.item.unitPrice * payload.quantity) + (state.deliveryUnitPrice * (state.weight + payload.item.weight * payload.quantity) / 100)),
            };
        case actions.DECREMENT_IN_CART:

            item = state.products[payload.item.id] || {
                quantity: 0,
                weight: 0,
                totalPrice: 0,
            };

            return {
                ...state,
                quantity: state.quantity - payload.quantity,
                weight: state.weight - payload.item.weight * payload.quantity,
                totalPrice: state.totalPrice - (payload.item.unitPrice * payload.quantity),
                ids: item.quantity - payload.quantity <= 0 ? state.ids.filter(i => i !== payload.item.id) : state.ids,
                products: {...state.products, [payload.item.id]: {
                        quantity: item.quantity - payload.quantity,
                        weight: item.weight - payload.item.weight * payload.quantity,
                        totalPrice: item.totalPrice - payload.item.unitPrice * payload.quantity,
                    }},
                deliveryTotalPrice: Math.round(state.deliveryUnitPrice * (state.weight - payload.item.weight * payload.quantity) / 100),
                totalPriceWithDelivery: Math.round((state.totalPrice - (payload.item.unitPrice * payload.quantity)) + (state.deliveryUnitPrice * (state.weight - payload.item.weight * payload.quantity) / 100)),
            };
        case ON_DELETE_PRODUCT:
        case actions.DELETE_FROM_CART:
            if (type === ON_DELETE_PRODUCT && state.products[payload.product.id] === undefined) {
                return state;
            }
            const {quantity, weight, totalPrice} = state.products[payload.product.id] || {};

            return {
                ...state,
                quantity: state.quantity - quantity,
                weight: state.weight - weight,
                totalPrice: state.totalPrice - totalPrice,
                ids: state.ids.filter(id => id !== payload.product.id),
                products: {...state.products, [payload.product.id]: undefined},
                deliveryTotalPrice: Math.round(state.deliveryUnitPrice * (state.weight - weight) / 100),
                totalPriceWithDelivery: Math.round((state.totalPrice - totalPrice) + (state.deliveryUnitPrice * (state.weight - weight) / 100)),
            };
        case SYNC_QUANTITIES:
            if (!state.quantity) {
                return state;
            }
            const newState = {...state};
            payload.productsIds.forEach(id => {
                if (state.ids.indexOf(id) > -1) {
                    const {stock = 0, weight, unitPrice} = payload.productsById[id];
                    const productInCart = newState.products[id];
                    const productInCartQuantity = productInCart.quantity;
                    if (productInCartQuantity > stock) {
                        const quantitySubtract = productInCartQuantity - stock;
                        const newWeight = newState.weight - weight * quantitySubtract;
                        const newTotalPrice = newState.totalPrice - unitPrice * quantitySubtract;
                        const newDeliveryTotalPrice = newState.deliveryUnitPrice * newWeight / 100;
                        newState.quantity -= quantitySubtract;
                        newState.weight = newWeight;
                        newState.totalPrice = newTotalPrice;
                        newState.deliveryTotalPrice = Math.round(newDeliveryTotalPrice);
                        newState.totalPriceWithDelivery = Math.round(newTotalPrice + newDeliveryTotalPrice);
                        if (stock) {
                            newState.products[id] = {
                                ...productInCart,
                                quantity: quantity,
                                weight: weight * stock,
                                totalPrice: unitPrice * stock,
                            };
                        } else {
                            newState.products[id] = undefined;
                            newState.ids = newState.ids.filter(i => i !== id);
                        }
                    }
                }
            });

            return newState;

        case CREATE_ORDER_SUCCESS:
            return {...initialCartState};
        default:
            return state;
    }
};