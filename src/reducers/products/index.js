import {ADD_TO_CART, REMOVE_FROM_CART} from "../../actions/cart";

const initialState = {
    items: [
        {
            'id': '1',
            'categoryId': '1',
            'title': 'Stroik 1',
            'slug': 'stroik-1',
            'active': true,
            'amount': 0,
            'inCart': 2,
            'price': 35,
            'img': 'stroik_1.jpg',
        },
        {
            'id': '2',
            'categoryId': '1',
            'title': 'Stroik 2',
            'slug': 'stroik-2',
            'active': true,
            'amount': 0,
            'inCart': 0,
            'price': 45,
            'img': 'stroik_2.jpg',
        },
        {
            'id': '3',
            'categoryId': '1',
            'title': 'Stroik 3',
            'slug': 'stroik-3',
            'active': true,
            'amount': 30,
            'inCart': 1,
            'price': 55,
            'img': 'stroik_3.jpg',
        },
        {
            'id': '4',
            'categoryId': '1',
            'title': 'Stroik 4',
            'slug': 'stroik-4',
            'active': true,
            'amount': 3,
            'inCart': 3,
            'price': 70,
            'img': 'stroik_4.jpg',
        },
    ],
};

const products = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            return {
                ...state,
                items: state.items.map(i => {
                    if (i.id === action.payload.productId) {
                        return {
                            ...i,
                            amount: i.amount -= action.payload.amount,
                            inCart: i.inCart += action.payload.amount,
                        };
                    }
                    return i;
                }),
            };
        case REMOVE_FROM_CART:
            return {
                ...state,
                items: state.items.map(i => {
                    if (i.id === action.payload.productId) {
                        return {
                            ...i,
                            amount: i.amount += action.payload.amount,
                            inCart: i.inCart -= action.payload.amount,
                        };
                    }
                    return i;
                }),
            };
        default:
            return state;
    }
};

export default products;
