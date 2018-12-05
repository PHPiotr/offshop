import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    EMPTY_CART,
} from '../../actions/cart';

const initialState = {
    count: 0,
};

const cart = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            return {
                ...state,
                count: state.count += (action.payload || 1),
            };
        case REMOVE_FROM_CART:
            return {
                ...state,
                count: state.count -= (action.payload || 1),
            };
        case EMPTY_CART:
            return {
                ...state,
                count: 0,
            };
        default:
            return state;
    }
};

export default cart;
