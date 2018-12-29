import {ADD_TO_CART, REMOVE_FROM_CART} from '../../actions/cart';
import {CREATE_ORDER_SUCCESS, RETRIEVE_ORDER_SUCCESS} from "../../actions/order";
import {RETRIEVE_PRODUCTS_REQUEST, RETRIEVE_PRODUCTS_SUCCESS, RETRIEVE_PRODUCTS_FAILURE} from "../../actions/products";

export const initialState = {
    isFetching: false,
    error: null,
    items: [],
};

const products = (state = initialState, action) => {
    switch (action.type) {
        case RETRIEVE_PRODUCTS_REQUEST:
            return {...state, isFetching: true, error: null};
        case RETRIEVE_PRODUCTS_SUCCESS:
            return {...state, isFetching: false, items: action.payload.items, error: null};
        case RETRIEVE_PRODUCTS_FAILURE:
            return {...state, isFetching: false, error: action.payload.error};
        case ADD_TO_CART:
            return {
                ...state,
                items: state.items.map(item => {
                    if (item._id === action.payload.item._id) {
                        return {
                            ...item,
                            quantity: (item.quantity -= action.payload.quantity),
                            inCart: (item.inCart += action.payload.quantity),
                        };
                    }
                    return item;
                }),
            };
        case REMOVE_FROM_CART:
            return {
                ...state,
                items: state.items.map(i => {
                    if (i.id === action.payload.item.id) {
                        return {
                            ...i,
                            quantity: (i.quantity += action.payload.quantity),
                            inCart: (i.inCart -= action.payload.quantity),
                        };
                    }
                    return i;
                }),
            };
        case RETRIEVE_ORDER_SUCCESS:
        case CREATE_ORDER_SUCCESS:
            return {
                ...state,
                items: state.items.map(i => ({...i, inCart: 0})),
            };
        default:
            return state;
    }
};

export default products;
