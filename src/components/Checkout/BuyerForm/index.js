import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Field, Form, reduxForm} from 'redux-form';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const renderTextField = ({input, label, meta, ...custom}) => (
    <TextField
        label={label}
        error={meta.touched && !!meta.error}
        helperText={meta.touched && meta.error}
        {...input}
        {...custom}
    />
);

const validateRequired = value => typeof value === 'string' && value.trim() ? undefined : 'To pole jest wymagane';
const validateEmail = value => value && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? undefined : 'Niepoprawny email';

let BuyerForm = props => {
    return (
        <Form onSubmit={props.onSubmit}>
            <Grid container spacing={24}>
                {props.inputKeys.reduce((acc, itemId) => {
                    const {label, type, validate} = props.inputs[itemId];
                    if (type === 'hidden') {
                        return acc;
                    }
                    const validateFunctions = [];
                    let required = false;
                    validate.forEach(rule => {
                        switch (rule) {
                            case 'required':
                                validateFunctions.push(validateRequired);
                                required = true;
                                break;
                            case 'email':
                                validateFunctions.push(validateEmail);
                                break;
                            default:
                                throw Error('Unknown validation rule');
                        }
                    });
                    acc.push(
                        <Grid item xs={12} key={itemId}>
                            <Field
                                name={itemId}
                                component={renderTextField}
                                label={label}
                                fullWidth
                                type={type}
                                required={required}
                                validate={validateFunctions}
                                noValidate
                            />
                        </Grid>
                    );
                    return acc;
                }, [])}
            </Grid>
        </Form>
    );
};

const mapStateToProps = state => ({
    inputKeys: state.buyer.ids,
    inputs: state.buyer.data,
});

BuyerForm = connect(mapStateToProps)(BuyerForm);

BuyerForm = reduxForm({
    form: 'buyer',
    destroyOnUnmount: false,
})(BuyerForm);

BuyerForm.propTypes = {
    inputKeys: PropTypes.array,
    inputs: PropTypes.object,
    onSubmit: PropTypes.func,
};

BuyerForm.defaultProps = {
    inputKeys: [],
    inputs: {},
    onSubmit: () => null,
};

export default BuyerForm;
