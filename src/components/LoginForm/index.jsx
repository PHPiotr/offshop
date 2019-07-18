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

let LoginForm = props => {
    return (
        <Form onSubmit={props.onSubmit}>
            <Grid container spacing={10}>
                <Grid item xs={12}>
                    <Field
                        name="username"
                        component={renderTextField}
                        label="Username"
                        fullWidth
                        type="text"
                        required
                        noValidate
                    />
                </Grid>
                <Grid item xs={12}>
                    <Field
                        name="password"
                        component={renderTextField}
                        label="Password"
                        fullWidth
                        type="password"
                        required
                        noValidate
                    />
                </Grid>
            </Grid>
        </Form>
    );
};

const mapStateToProps = state => ({});

LoginForm = connect(mapStateToProps)(LoginForm);

LoginForm = reduxForm({
    form: 'login'
})(LoginForm);

LoginForm.propTypes = {
    onSubmit: PropTypes.func,
};

LoginForm.defaultProps = {
    onSubmit: () => null,
};

export default LoginForm;
