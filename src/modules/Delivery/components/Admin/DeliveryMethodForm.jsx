import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Field, Form, isValid, reduxForm} from 'redux-form';
import {Box, Button, makeStyles} from '@material-ui/core';
import {inputs, inputKeys, initialValues, formName} from '../../config';
import {resetDeliveryMethod} from '../../actions';
import {showNotification} from '../../../../actions/notification';
import {useSocket} from '../../../../contexts/SocketContext';

const useStyles = makeStyles(theme => ({
    form: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        width: '100%',
    },
    box: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-start',
    },
    button: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
}));

let DeliveryMethodForm = props => {

    const classes = useStyles();
    const socket = useSocket();

    useEffect(() => {
        return () => {
            props.handleResetDeliveryMethod();
        }
    }, []);

    const onAdminCreateDeliveryListener = ({deliveryMethod}) => props.showNotification({
        message: `Opcja dostawy ${deliveryMethod.name} została dodana.`,
        variant: 'success',
    });

    const onAdminUpdateDeliveryListener = ({deliveryMethod}) => props.showNotification({
        message: `Opcja dostawy ${deliveryMethod.name} została zmieniona.`,
        variant: 'success',
    });

    useEffect(() => {
        socket.on('adminCreateDelivery', onAdminCreateDeliveryListener);
        socket.on('adminUpdateDelivery', onAdminUpdateDeliveryListener);
        return () => {
            socket.off('adminCreateDelivery', onAdminCreateDeliveryListener);
            socket.off('adminUpdateDelivery', onAdminUpdateDeliveryListener);
        }
    }, []);

    return (
        <Form className={classes.form} onSubmit={props.handleSubmit}>
            {inputKeys.reduce((acc, itemId) => {
                const {label, type, validate, component, inputProps} = inputs[itemId];
                acc.push(
                    <Box key={itemId} className={classes.box}>
                        <Field
                            data-testid={itemId}
                            name={itemId}
                            component={component}
                            label={label}
                            fullWidth
                            type={type}
                            validate={validate}
                            InputProps={inputProps}
                        />
                    </Box>
                );
                return acc;
            }, [])}
            <Box className={classes.buttons}>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    disabled={props.submitting || !props.isValidDeliveryMethod}
                    type="submit"
                >
                    Zapisz
                </Button>
            </Box>
        </Form>
    );
};

DeliveryMethodForm = reduxForm({
    form: formName,
    initialValues,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
})(DeliveryMethodForm);

DeliveryMethodForm.propTypes = {
    isValidDeliveryMethod: PropTypes.bool,
};

DeliveryMethodForm.defaultProps = {
    isValidDeliveryMethod: false,
};

const mapStateToProps = state => {
    const initialValues = {...state.adminDeliveryMethod.data[state.adminDeliveryMethod.id]};
    if (initialValues.unitPrice) {
        initialValues.unitPrice = (initialValues.unitPrice / 100).toFixed(2);
    }
    return {
        isRequestInProgress: state.adminDeliveryMethod.isCreating || state.adminDeliveryMethod.isFetching || state.adminDeliveryMethod.isDeleting,
        accessToken: state.auth.accessToken,
        isValidDeliveryMethod: isValid(formName)(state),
        initialValues: initialValues,
        values: state.adminDeliveryMethod.data[state.adminDeliveryMethod.id],
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    showNotification(payload) {
        dispatch(showNotification(payload));
    },
    handleResetDeliveryMethod() {
        dispatch(resetDeliveryMethod());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryMethodForm);
