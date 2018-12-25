import { ADD_TO_CART, REMOVE_FROM_CART } from '../../actions/cart';
import {CREATE_ORDER_SUCCESS, RETRIEVE_ORDER_SUCCESS} from "../../actions/order";

const initialState = {
    amount: 0,
    units: 0,
    totalPrice: 0,
    items: [],
};

const cart = (state = initialState, { payload, type }) => {
    switch (type) {
        case ADD_TO_CART:
            return {
                ...state,
                amount: (state.amount += payload.amount),
                units: (state.units +=
                    payload.item.unitsPerProduct * payload.amount),
                totalPrice: (state.totalPrice +=
                    payload.item.price * payload.amount),
            };
        case REMOVE_FROM_CART:
            return {
                ...state,
                amount: (state.amount -= payload.amount),
                units: (state.units -=
                    payload.item.unitsPerProduct * payload.amount),
                totalPrice: (state.totalPrice -=
                    payload.item.price * payload.amount),
            };
        case RETRIEVE_ORDER_SUCCESS:
        case CREATE_ORDER_SUCCESS:
            return {
                ...state,
                amount: 0,
                units: 0,
                totalPrice: 0,
                items: [],
            };
        default:
            return state;
    }
};

export default cart;
