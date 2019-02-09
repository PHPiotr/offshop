import {ADD_TO_CART, REMOVE_FROM_CART} from '../../actions/cart';
import {CREATE_ORDER_SUCCESS, RETRIEVE_ORDER_SUCCESS} from "../../actions/order";

const initialState = {
    quantity: 0,
    units: 0,
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
                units: 0,
                totalPrice: 0,
            };

            return {
                ...state,
                quantity: (state.quantity += payload.quantity),
                units: (state.units += payload.item.unitsPerProduct * payload.quantity),
                totalPrice: (state.totalPrice += payload.item.price * payload.quantity),
                ids: state.ids.find(i => i === payload.item._id) ? state.ids : [...state.ids, payload.item._id],
                products: {...state.products, [payload.item._id]: {
                    quantity: item.quantity + 1,
                    units: item.units + payload.item.unitsPerProduct * payload.quantity,
                    totalPrice: item.totalPrice + payload.item.price * payload.quantity,
                }}
            };
        case REMOVE_FROM_CART:

            item = state.products[payload.item._id] || {
                quantity: 0,
                units: 0,
                totalPrice: 0,
            };

            return {
                ...state,
                quantity: (state.quantity -= payload.quantity),
                units: (state.units -= payload.item.unitsPerProduct * payload.quantity),
                totalPrice: (state.totalPrice -= payload.item.price * payload.quantity),
                ids: item.quantity - payload.quantity <= 0 ? state.ids.filter(i => i !== payload.item._id) : state.ids,
                products: {...state.products, [payload.item._id]: {
                    quantity: item.quantity - payload.quantity,
                    units: item.units - payload.item.unitsPerProduct * payload.quantity,
                    totalPrice: item.totalPrice + payload.item.price * payload.quantity,
                }}
            };
        case CREATE_ORDER_SUCCESS:
            return initialState;
        default:
            return state;
    }
};

export default cart;
