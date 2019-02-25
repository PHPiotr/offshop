import {combineReducers} from 'redux';
import {SET_PRODUCT_INPUT_VALUE} from '../../actions/product';

const initialIds = [
    'name',
    'quantity',
    'price',
    'unit',
    'unitsPerProduct',
    'img',
];

const initialData = {
    name: {
        value: '',
        type: 'text',
        label: 'Nazwa',
        validate: ['required'],
    },
    quantity: {
        value: '',
        type: 'number',
        min: 0,
        label: 'Ilość',
        validate: ['required'],
    },
    price: {
        value: '',
        type: 'text',
        label: 'Cena',
        validate: ['required'],
    },
    unit: {
        value: 'kg',
        type: 'text',
        label: 'Jednostka',
        validate: ['required'],
    },
    unitsPerProduct: {
        value: '',
        type: 'number',
        min: 0,
        label: 'Ilość jednostek na produkt',
        validate: ['required'],
    },
    img: {
        value: '',
        type: 'file',
        label: 'Zdjęcie produktu',
        validate: ['required'],
    },
};

const ids = (state = initialIds, {type}) => {
    switch (type) {
        default:
            return state;
    }
};

const data = (state = initialData, {type, payload}) => {
    switch (type) {
        case SET_PRODUCT_INPUT_VALUE:
            return {
                ...state,
                [payload.name]: {
                    ...state[payload.name],
                    value: payload.value,
                },
            };
        default:
            return state;
    }
};

const product = combineReducers({ids, data});

export default product;
