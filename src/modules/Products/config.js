import React from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import {
    renderTextField as TextField,
    renderSwitch as SwitchField,
    validatePrice,
    validateRequired,
    validateMinLength,
    validateMaxLength,
} from '../../utils/form';
import DropZoneField from '../../components/FileInput/DropzoneField';

export const formName = 'product';

export const inputKeys = [
    'name',
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
    description: {
        type: 'text',
        label: 'Krótki opis produktu',
        validate: [validateRequired, validateMinLength(15), validateMaxLength(160)],
        component: TextField,
        inputProps: {
            minLength: 15,
            maxLength: 160,
            multiline: true,
            rows: 2,
        },
    },
    longDescription: {
        type: 'text',
        label: 'Rozszerzony opis produktu',
        validate: [validateMinLength(15), validateMaxLength(1000)],
        component: TextField,
        inputProps: {
            minLength: 15,
            maxLength: 1000,
            multiline: true,
            rows: 5,
        },
    },
    stock: {
        type: 'number',
        label: 'Dostępna ilość',
        validate: [validateRequired],
        component: TextField,
        inputProps: {
            inputProps: {
                min: 0,
            },
            endAdornment: <InputAdornment position="start">szt.</InputAdornment>
        },
    },
    unitPrice: {
        type: 'number',
        label: 'Cena produktu',
        validate: [validateRequired, validatePrice],
        component: TextField,
        inputProps: {
            inputProps: {
                min: 0.01,
                step: 0.01,
            },
            endAdornment: <InputAdornment position="start">zł</InputAdornment>
        },
    },
    weight: {
        type: 'number',
        label: 'Waga produktu',
        validate: [validateRequired],
        component: TextField,
        inputProps: {
            inputProps: {
                min: 0.001,
                step: 0.001,
            },
            endAdornment: <InputAdornment position="start">kg</InputAdornment>
        },
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
        inputProps: {
            'data-testid': 'img',
        },
    },
};