import { ADD_TO_CART, REMOVE_FROM_CART } from '../../actions/cart';
import {CREATE_ORDER_SUCCESS, RETRIEVE_ORDER_SUCCESS} from "../../actions/order";

const initialState = {
    items: [
        {
            id: '1',
            categoryId: '1',
            name: 'Stroik 1',
            slug: 'stroik-1',
            active: true,
            quantity: 2,
            inCart: 0,
            price: 35,
            unitPrice: 35,
            img: 'stroik_1.jpg',
            unitsPerProduct: 1,
            unit: 'kg',
        },
        {
            id: '2',
            categoryId: '1',
            name: 'Stroik 2',
            slug: 'stroik-2',
            active: true,
            quantity: 0,
            inCart: 0,
            price: 45,
            unitPrice: 45,
            img: 'stroik_2.jpg',
            unitsPerProduct: 1,
            unit: 'kg',
        },
        {
            id: '3',
            categoryId: '1',
            name: 'Stroik 3',
            slug: 'stroik-3',
            active: true,
            quantity: 30,
            inCart: 0,
            price: 55,
            unitPrice: 55,
            img: 'stroik_3.jpg',
            unitsPerProduct: 1,
            unit: 'kg',
        },
        {
            id: '4',
            categoryId: '1',
            name: 'Stroik 4',
            slug: 'stroik-4',
            active: true,
            quantity: 3,
            inCart: 0,
            price: 70,
            unitPrice: 70,
            img: 'stroik_4.jpg',
            unitsPerProduct: 1,
            unit: 'kg',
        },
    ],
};

const products = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            return {
                ...state,
                items: state.items.map(item => {
                    if (item.id === action.payload.item.id) {
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
