import React, {Fragment, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Field, Form, reduxForm, isValid} from 'redux-form';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import {createDeliveryMethodIfNeeded, updateDeliveryMethodIfNeeded} from "../../../actions/admin/deliveryMethod";
import {showNotification} from "../../../actions/notification";
import SubHeader from '../../../components/SubHeader';
import ProgressIndicator from '../../../components/ProgressIndicator';
import {getAdminDeliveryMethodIfNeeded} from '../../../actions/admin/deliveryMethod';
import {inputs, inputKeys, initialValues} from './config';

const FORM_NAME = 'deliveryMethod';

window.URL = window.URL || window.webkitURL;

const styles = theme => ({
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit,
    },
});

let DeliveryMethodForm = props => {
    useEffect(() => {
        if (props.match.params.id) {
            props.getAdminDeliveryMethodIfNeeded(props.match.params.id);
        }
    }, [props.match.params.id]);

    return (
        <Fragment>
            {props.isRequestInProgress && <ProgressIndicator/>}
            <SubHeader content={`${props.match.params.id ? 'Edytuj' : 'Dodaj'} opcję dostawy`}/>
            <Form onSubmit={props.handleSubmit}>
                <Grid container spacing={24}>
                    {inputKeys.reduce((acc, itemId) => {
                        const {label, type, validate, component, inputProps} = inputs[itemId];
                        acc.push(
                            <Grid item xs={12} key={itemId}>
                                <Field
                                    name={itemId}
                                    component={component}
                                    label={label}
                                    fullWidth
                                    type={type}
                                    validate={validate}
                                    InputProps={inputProps}
                                />
                            </Grid>
                        );
                        return acc;
                    }, [])}
                </Grid>
                <div className={props.classes.buttons}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={props.classes.button}
                        disabled={props.submitting || !props.isValidDeliveryMethod}
                        type="submit"
                    >
                        {`${props.match.params.id ? 'Edytuj' : 'Dodaj'}`}
                    </Button>
                </div>
            </Form>
        </Fragment>
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
    return {
        isRequestInProgress: state.adminDeliveryMethod.isCreating || state.adminDeliveryMethod.isFetching || state.adminDeliveryMethod.isDeleting,
        accessToken: state.auth.accessToken,
        isValidDeliveryMethod: isValid(FORM_NAME)(state),
        initialValues: state.adminDeliveryMethod.data[state.adminDeliveryMethod.id],
        values: state.adminDeliveryMethod.data[state.adminDeliveryMethod.id],
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    getAdminDeliveryMethodIfNeeded(deliveryMethodId) {
        return dispatch(getAdminDeliveryMethodIfNeeded(deliveryMethodId));
    },
    onSubmit: async (formProps, _, {accessToken, reset}) => {
        try {
            if (ownProps.match.params.id) {
                await dispatch(updateDeliveryMethodIfNeeded(formProps, accessToken));
            } else {
                await dispatch(createDeliveryMethodIfNeeded(formProps, accessToken));
            }
            ownProps.history.push('/admin/delivery-methods/list');
            reset();
        } catch (e) {
            dispatch(showNotification({message: e.message, variant: 'error'}));
        }
    },
});

DeliveryMethodForm = connect(mapStateToProps, mapDispatchToProps)(DeliveryMethodForm);

export default withStyles(styles)(DeliveryMethodForm);
