import {ADD_TO_CART, DECREMENT_IN_CART, DELETE_FROM_CART} from '../../actions/cart';
import {CREATE_ORDER_SUCCESS} from "../../actions/order";
import {SYNC_QUANTITIES} from '../../actions/products';

const initialState = {
    quantity: 0,
    weight: 0,
    totalPrice: 0,
    ids: [],
    products: {},
};

const cart = (state = initialState, { payload, type }) => {
    let item;
    switch (type) {
        case ADD_TO_CART:

            item = state.products[payload.item._id] || {
                quantity: 0,
                weight: 0,
                totalPrice: 0,
            };

            return {
                ...state,
                quantity: (state.quantity += payload.quantity),
                weight: (state.weight += payload.item.weight * payload.quantity),
                totalPrice: state.totalPrice += payload.item.unitPrice * 100 * payload.quantity,
                ids: state.ids.find(i => i === payload.item._id) ? state.ids : [...state.ids, payload.item._id],
                products: {...state.products, [payload.item._id]: {
                    quantity: item.quantity + 1,
                    weight: item.weight + payload.item.weight * payload.quantity,
                    totalPrice: item.totalPrice + payload.item.unitPrice * 100 * payload.quantity,
                }}
            };
        case DECREMENT_IN_CART:

            item = state.products[payload.item._id] || {
                quantity: 0,
                weight: 0,
                totalPrice: 0,
            };

            return {
                ...state,
                quantity: (state.quantity -= payload.quantity),
                weight: (state.weight -= payload.item.weight * payload.quantity),
                totalPrice: state.totalPrice -= (payload.item.unitPrice * 100 * payload.quantity),
                ids: item.quantity - payload.quantity <= 0 ? state.ids.filter(i => i !== payload.item._id) : state.ids,
                products: {...state.products, [payload.item._id]: {
                    quantity: item.quantity - payload.quantity,
                    weight: item.weight - payload.item.weight * payload.quantity,
                    totalPrice: item.totalPrice + payload.item.unitPrice * 100 * payload.quantity,
                }}
            };
        case DELETE_FROM_CART:

            const {itemId} = payload;
            const {quantity, weight, totalPrice} = state.products[itemId];

            return {
                ...state,
                quantity: (state.quantity -= quantity),
                weight: (state.weight -= weight),
                totalPrice: state.totalPrice -= totalPrice,
                ids: state.ids.filter(id => id !== itemId),
                products: {...state.products, [itemId]: undefined},
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
                        newState.quantity -= quantitySubtract;
                        newState.weight -= weight * quantitySubtract;
                        newState.totalPrice -= unitPrice * 100 * quantitySubtract;
                        if (stock) {
                            newState.products[id] = {
                                ...productInCart,
                                quantity: quantity,
                                weight: weight * stock,
                                totalPrice: unitPrice * 100 * stock,
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
            return {
                quantity: 0,
                weight: 0,
                totalPrice: 0,
                ids: [],
                products: {},
            };
        default:
            return state;
    }
};

export default cart;
