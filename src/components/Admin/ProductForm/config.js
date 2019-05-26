import {
    renderTextField as TextField,
    renderSwitch as SwitchField,
    validatePrice,
    validateRequired,
    validateMinLength,
    validateMaxLength,
} from '../../../utils/form';
import DropZoneField from '../../../components/FileInput/DropzoneField';

export const inputKeys = [
    'name',
    'slug',
    'description',
    'longDescription',
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
    description: {
        type: 'text',
        label: 'Krótki opis produktu',
        validate: [validateRequired, validateMinLength(100), validateMaxLength(160)],
        component: TextField,
        inputProps: {
            minlength: 100,
            maxlength: 160,
            multiline: true,
            rows: 2,
            maxRows: 4,
        },
    },
    longDescription: {
        type: 'text',
        label: 'Rozszerzony opis produktu',
        validate: [validateMinLength(250), validateMaxLength(1000)],
        component: TextField,
        inputProps: {
            minlength: 250,
            maxlength: 1000,
            multiline: true,
            rows: 5,
            maxRows: 10,
        },
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