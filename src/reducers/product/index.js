import {combineReducers} from 'redux';
import {SET_PRODUCT_INPUT_VALUE} from '../../actions/product';
import {
    formatPrice,
    normalizePrice,
    validateRequired,
    renderTextField as TextField,
} from '../../utils/form';
import DropZoneField from '../../components/FileInput/DropzoneField';

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
        validate: [validateRequired],
        component: TextField,
    },
    quantity: {
        value: '',
        type: 'number',
        min: 0,
        label: 'Ilość',
        validate: [validateRequired],
        component: TextField,
    },
    price: {
        value: '',
        type: 'text',
        label: 'Cena',
        validate: [validateRequired],
        format: formatPrice,
        normalize: normalizePrice,
        component: TextField,
    },
    unit: {
        value: 'kg',
        type: 'text',
        label: 'Jednostka',
        validate: [validateRequired],
        component: TextField,
    },
    unitsPerProduct: {
        value: '',
        type: 'number',
        min: 0,
        label: 'Ilość jednostek na produkt',
        validate: [validateRequired],
        component: TextField,
    },
    img: {
        value: '',
        type: 'file',
        label: 'Zdjęcie produktu',
        validate: [validateRequired],
        component: DropZoneField,
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
