import React from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import {
    renderTextField as TextField,
    validatePrice,
    validateRequired,
} from '../../../utils/form';

export const inputKeys = [
    'name',
    'unitPrice',
];

export const initialValues = {
    name: '',
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
    unitPrice: {
        type: 'number',
        label: 'Cena za kg',
        validate: [validateRequired, validatePrice],
        component: TextField,
        inputProps: {
            inputProps: {
                min: 0.00,
                step: 0.01,
            },
            endAdornment: <InputAdornment position="start">zł/kg</InputAdornment>
        },
    },
};