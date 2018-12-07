import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    EMPTY_CART,
    REMOVE_ITEM_FROM_CART,
} from '../../actions/cart';

const initialState = {
    amount: 6,
};

const cart = (state = initialState, {payload, type}) => {
    switch (type) {
        case ADD_TO_CART:
            return {
                ...state,
                amount: state.amount += (payload.amount),
            };
        case REMOVE_FROM_CART:
            return {
                ...state,
                amount: state.amount -= (payload.amount),
            };
        case REMOVE_ITEM_FROM_CART:
            return {
                ...state,
                amount: state.amount -= (payload.amount),
            };
        case EMPTY_CART:
            return {
                ...state,
                amount: 0,
            };
        default:
            return state;
    }
};

export default cart;
