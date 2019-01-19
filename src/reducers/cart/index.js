import {ADD_TO_CART, REMOVE_FROM_CART} from '../../actions/cart';
import {CREATE_ORDER_SUCCESS, RETRIEVE_ORDER_SUCCESS} from "../../actions/order";

const initialState = {
    quantity: 0,
    units: 0,
    totalPrice: 0,
    ids: [],
};

const cart = (state = initialState, { payload, type }) => {
    switch (type) {
        case ADD_TO_CART:
            return {
                ...state,
                quantity: (state.quantity += payload.quantity),
                units: (state.units += payload.item.unitsPerProduct * payload.quantity),
                totalPrice: (state.totalPrice += payload.item.price * payload.quantity),
                ids: state.ids.find(i => i === payload.item._id) ? state.ids : [...state.ids, payload.item._id],
            };
        case REMOVE_FROM_CART:
            return {
                ...state,
                quantity: (state.quantity -= payload.quantity),
                units: (state.units -= payload.item.unitsPerProduct * payload.quantity),
                totalPrice: (state.totalPrice -= payload.item.price * payload.quantity),
                ids: payload.item.inCart - payload.quantity === 0 ? state.ids.filter(i => i !== payload.item._id) : state.ids,
            };
        case CREATE_ORDER_SUCCESS:
            return {
                ...state,
                quantity: 0,
                units: 0,
                totalPrice: 0,
                ids: [],
            };
        default:
            return state;
    }
};

export default cart;
