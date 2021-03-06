import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Field, Form, reduxForm} from 'redux-form';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core';
import {validateEmail, validateRequired} from '../../../utils/form';

const renderTextField = ({input, label, meta, ...custom}) => (
    <TextField
        label={label}
        error={meta.touched && !!meta.error}
        helperText={meta.touched && meta.error}
        {...input}
        {...custom}
    />
);

const useStyles = makeStyles(theme => ({
    form: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        paddingTop: theme.spacing(2),
    },
}));

let BuyerForm = props => {

    const classes = useStyles();

    return (
        <Form onSubmit={props.onSubmit} className={classes.form}>
            <Grid container spacing={10}>
                {props.inputKeys.reduce((acc, itemId) => {
                    const {label, type, validate} = props.inputs[itemId];
                    const validateFunctions = [];
                    let required = false;
                    validate.forEach(rule => {
                        if (rule === 'required') {
                            validateFunctions.push(validateRequired);
                            required = true;
                        }
                        if (rule === 'email') {
                            validateFunctions.push(validateEmail);
                        }
                    });
                    acc.push(
                        <Grid item xs={12} key={itemId}>
                            <Field
                                data-testid={itemId}
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
};

export default BuyerForm;
