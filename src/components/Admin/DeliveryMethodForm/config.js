import {
    renderTextField as TextField,
    validatePrice,
    validateRequired,
} from '../../../utils/form';

export const inputKeys = [
    'name',
    'slug',
    'unitPrice',
];

export const initialValues = {
    name: '',
    slug: '',
    unitPrice: '',
};

export const inputs = {
    name: {
        type: 'text',
        label: 'Nazwa',
        validate: [validateRequired],
        component: TextField,
        inputProps: {},
    },
    slug: {
        type: 'text',
        label: 'Slug',
        validate: [validateRequired],
        component: TextField,
        inputProps: {},
    },
    unitPrice: {
        type: 'number',
        label: 'Cena za kilogram',
        validate: [validateRequired, validatePrice],
        component: TextField,
        inputProps: {inputProps: {min: 0.00, step: 0.01}},
    },
};