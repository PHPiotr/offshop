import {
    renderTextField as TextField,
    renderSwitch as SwitchField,
    validatePrice,
    validateRequired,
} from '../../../utils/form';
import DropZoneField from '../../../components/FileInput/DropzoneField';

export const inputKeys = [
    'name',
    'slug',
    'stock',
    'unitPrice',
    'weight',
    'active',
    'img',
];

export const initialValues = {
    name: '',
    slug: '',
    stock: 1,
    unitPrice: '',
    weight: 1,
    active: true,
    img: null,
};

export const inputs = {
    name: {
        type: 'text',
        label: 'Nazwa produktu',
        validate: [validateRequired],
        component: TextField,
        inputProps: {},
    },
    slug: {
        type: 'text',
        label: 'Slug produktu',
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
    active: {
        type: 'switch',
        label: 'Aktywny',
        component: SwitchField,
        inputProps: {},
    },
    img: {
        type: 'file',
        label: 'Zdjęcie produktu',
        validate: [validateRequired],
        component: DropZoneField,
        inputProps: {},
    },
};