import React, {useContext, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Field, Form, reduxForm, isValid} from 'redux-form';
import {Box} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import {
    createDeliveryMethodIfNeeded,
    updateDeliveryMethodIfNeeded,
    getAdminDeliveryMethodIfNeeded,
    resetDeliveryMethod
} from "../../actions";
import {showNotification} from "../../../../actions/notification";
import SubHeader from '../../../../components/SubHeader';
import {inputs, inputKeys, initialValues} from '../../config';
import RequestHandler from '../../../../components/RequestHandler';
import SocketContext from '../../../../SocketContext';

const FORM_NAME = 'deliveryMethod';

window.URL = window.URL || window.webkitURL;

const styles = theme => ({
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
});

let DeliveryMethodForm = props => {
    const socket = useContext(SocketContext);
    const onAdminCreateDeliveryListener = deliveryMethod => props.showNotification({
        message: `Opcja dostawy ${deliveryMethod.name} została dodana.`,
        variant: 'success',
    });

    const onAdminUpdateDeliveryListener = deliveryMethod => props.showNotification({
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

    useEffect(() => {
        props.handleResetDeliveryMethod();
        return () => {
            props.handleResetDeliveryMethod();
        }
    }, [props.match.params.id]);

    return (
        <RequestHandler
            action={() => props.match.params.id ? props.getAdminDeliveryMethodIfNeeded(props.match.params.id) : Promise.resolve({})}
        >
            <SubHeader content={`${props.match.params.id ? 'Edytuj' : 'Dodaj'} opcję dostawy`}/>
            <Form className={props.classes.form} onSubmit={props.handleSubmit}>
                {inputKeys.reduce((acc, itemId) => {
                    const {label, type, validate, component, inputProps} = inputs[itemId];
                    acc.push(
                        <Box key={itemId} className={props.classes.box}>
                            <Field
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
                <Box className={props.classes.buttons}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={props.classes.button}
                        disabled={props.submitting || !props.isValidDeliveryMethod}
                        type="submit"
                    >
                        {`${props.match.params.id ? 'Edytuj' : 'Dodaj'}`}
                    </Button>
                </Box>
            </Form>
        </RequestHandler>
    );
};

DeliveryMethodForm = reduxForm({
    form: FORM_NAME,
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
        isValidDeliveryMethod: isValid(FORM_NAME)(state),
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
    getAdminDeliveryMethodIfNeeded(deliveryMethodId) {
        return dispatch(getAdminDeliveryMethodIfNeeded(deliveryMethodId));
    },
    onSubmit: async (formProps, _, {accessToken, reset}) => {
        try {
            let response;
            if (ownProps.match.params.id) {
                response = await dispatch(updateDeliveryMethodIfNeeded(formProps, accessToken));
            } else {
                response = await dispatch(createDeliveryMethodIfNeeded(formProps, accessToken));
            }

            const {status, data} = response;

            if (status === 200 || status === 201) {
                ownProps.history.push('/admin/delivery-methods/list');
                reset();
            } else {
                dispatch(showNotification({message: data.message, variant: 'error'}));
            }
        } catch (e) {
            dispatch(showNotification({message: e.message, variant: 'error'}));
        }
    },
});

DeliveryMethodForm = connect(mapStateToProps, mapDispatchToProps)(DeliveryMethodForm);

export default withStyles(styles)(DeliveryMethodForm);
