import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {createDeliveryMethodIfNeeded} from "../../actions";
import {showNotification} from "../../../../actions/notification";
import DeliveryMethodForm from './DeliveryMethodForm';
import SubHeader from '../../../../components/SubHeader';

let AddDeliveryMethod = props => (
    <>
        <SubHeader content="Dodaj opcję dostawy"/>
        <DeliveryMethodForm {...props} />
    </>
);

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: async (formProps, _, {accessToken, reset}) => {
        try {
            await dispatch(createDeliveryMethodIfNeeded(formProps, accessToken));
            ownProps.history.replace(`/admin/delivery-methods/list`);
        } catch (e) {
            await dispatch(showNotification({message: e.message, variant: 'error'}));
        }
    },
});

export default withRouter(connect(null, mapDispatchToProps)(AddDeliveryMethod));
