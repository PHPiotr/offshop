import {combineReducers} from 'redux';
import {
    CREATE_PRODUCT_FAILURE,
    CREATE_PRODUCT_REQUEST,
    CREATE_PRODUCT_SUCCESS,
    SET_PRODUCT_INPUT_VALUE
} from '../../actions/product';
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
        default:
            return state;
    }
};

const creating = (state = false, {type}) => {
    switch (type) {
        case CREATE_PRODUCT_REQUEST:
            return true;
        case CREATE_PRODUCT_SUCCESS:
        case CREATE_PRODUCT_FAILURE:
            return false;
        default:
            return state;
    }
};

const product = combineReducers({ids, data, creating});

export default product;
