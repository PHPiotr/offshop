import React from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import {
    renderSwitch as SwitchField,
    renderTextField as TextField,
    validatePrice,
    validateRequired,
} from '../../utils/form';

export const formName = 'deliveryMethod';

export const inputKeys = [
    'name',
    'unitPrice',
    'step',
    'stepPrice',
    'payAfterDelivery',
];

export const initialValues = {
    name: '',
    unitPrice: '',
    step: '',
    stepPrice: '',
    payAfterDelivery: false,
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
        label: 'Cena',
        validate: [validateRequired, validatePrice],
        component: TextField,
        inputProps: {
            inputProps: {
                min: 0.00,
                step: 0.01,
            },
            endAdornment: <InputAdornment position="start">zł</InputAdornment>
        },
    },
    step: {
        type: 'number',
        label: 'Zwiększ cenę co x kg',
        component: TextField,
        inputProps: {
            inputProps: {
                min: 1,
                step: 1,
            },
            endAdornment: <InputAdornment position="start">kg</InputAdornment>
        },
    },
    stepPrice: {
        type: 'number',
        label: 'Zwiększ cenę o x zł',
        component: TextField,
        inputProps: {
            inputProps: {
                min: 0.00,
                step: 0.01,
            },
            endAdornment: <InputAdornment position="start">zł</InputAdornment>
        },
    },
    payAfterDelivery: {
        type: 'switch',
        label: 'Płatność za pobraniem',
        component: SwitchField,
        inputProps: {},
    },
};