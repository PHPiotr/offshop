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

export const validateEmail = value => value && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? undefined : 'Niepoprawny email';

export const validateRequired = value => (!value ? 'To pole jest wymagane' : undefined);

export const validatePrice = value => {
    if (!value) {
        return undefined;
    }
    if (!/^\s*\d*\.\d*\s*$/.test(value) && !/^\s*\d*\s*$/.test(value)) {
        return 'Niewłaściwy format ceny';
    }
    return undefined;
}
