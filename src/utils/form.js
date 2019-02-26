import TextField from '@material-ui/core/TextField';
import React from 'react';

export const renderTextField = ({input, label, meta, ...custom}) => (
    <TextField
        label={label}
        error={meta.touched && !!meta.error}
        helperText={meta.touched && meta.error}
        {...input}
        {...custom}
    />
);

export const formatPrice = (input) => {
    if (!input) {
        return;
    }

    if (isNaN(parseInt(input[input.length - 1], 10))) {
        return input.slice(0, -1);
    }

    return input
        .replace(/,/g , '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const normalizePrice = (val) => {
    return val.replace(/,/g , '');
};

export const validateEmail = value => value && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? undefined : 'Niepoprawny email';

export const validateRequired = value => (!value ? 'To pole jest wymagane' : undefined);
