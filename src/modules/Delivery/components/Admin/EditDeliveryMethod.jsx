import React from 'react';
import {connect} from 'react-redux';
import {updateDeliveryMethodIfNeeded, getAdminDeliveryMethodIfNeeded} from "../../actions";
import {showNotification} from "../../../../actions/notification";
import DeliveryMethodForm from './DeliveryMethodForm';
import RequestHandler from '../../../../components/RequestHandler';
import SubHeader from '../../../../components/SubHeader';

let EditDeliveryMethod = props => (
    <RequestHandler action={() => props.getAdminDeliveryMethodIfNeeded(props.match.params.id)}>
        <SubHeader content="Edytuj opcję dostawy"/>
        <DeliveryMethodForm {...props} />
    </RequestHandler>
);

const mapDispatchToProps = (dispatch, ownProps) => ({
    getAdminDeliveryMethodIfNeeded(deliveryMethodId) {
        return dispatch(getAdminDeliveryMethodIfNeeded(deliveryMethodId));
    },
    onSubmit: async (formProps, _, {accessToken, reset}) => {
        try {
            await dispatch(updateDeliveryMethodIfNeeded(formProps, accessToken));
        } catch (e) {
            await dispatch(showNotification({message: e.message, variant: 'error'}));
        }
    },
});

export default connect(null, mapDispatchToProps)(EditDeliveryMethod);
