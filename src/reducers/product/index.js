import {combineReducers} from 'redux';
import {
    CREATE_PRODUCT_FAILURE,
    CREATE_PRODUCT_REQUEST,
    CREATE_PRODUCT_SUCCESS,
} from '../../actions/product';
import {
    validateRequired,
    validatePrice,
    renderTextField as TextField,
} from '../../utils/form';
import DropZoneField from '../../components/FileInput/DropzoneField';

const initialIds = [
    'name',
    'stock',
    'unitPrice',
    'weight',
    'img',
];

const initialData = {
    name: {
        type: 'text',
        label: 'Nazwa produktu',
        validate: [validateRequired],
        component: TextField,
        inputProps: {},
    },
    stock: {
        type: 'number',
        label: 'Dostępna ilość',
        validate: [validateRequired],
        component: TextField,
        inputProps: {inputProps: {min: 1}},
    },
    unitPrice: {
        type: 'number',
        label: 'Cena produktu (zł)',
        validate: [validateRequired, validatePrice],
        component: TextField,
        inputProps: {inputProps: {min: 0.01, step: 0.01}},
    },
    weight: {
        type: 'number',
        label: 'Waga produktu (kg)',
        validate: [validateRequired],
        component: TextField,
        inputProps: {inputProps: {min: 1.0, step: 0.1}},
    },
    img: {
        type: 'file',
        label: 'Zdjęcie produktu',
        validate: [validateRequired],
        component: DropZoneField,
        inputProps: {},
    },
};

const ids = (state = initialIds, {type}) => {
    switch (type) {
        default:
            return state;
    }
};

const data = (state = initialData, {type}) => {
    switch (type) {
        default:
            return state;
    }
};

const isCreating = (state = false, {type}) => {
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

const product = combineReducers({ids, data, isCreating});

export default product;
