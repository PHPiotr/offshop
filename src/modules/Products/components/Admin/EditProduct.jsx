import React from 'react';
import {connect} from 'react-redux';
import {getAdminProductIfNeeded, updateProductIfNeeded} from "../../../../modules/Products/actions";
import {showNotification} from "../../../../actions/notification";
import ProductForm from './ProductForm';
import RequestHandler from '../../../../components/RequestHandler';
import SubHeader from '../../../../components/SubHeader';

let EditProduct = props => (
    <RequestHandler action={() => props.getAdminProductIfNeeded(props.match.params.id)}>
        <SubHeader content="Edytuj produkt"/>
        <ProductForm {...props}/>
    </RequestHandler>
);

const mapDispatchToProps = dispatch => ({
    getAdminProductIfNeeded(productId) {
        return dispatch(getAdminProductIfNeeded(productId));
    },
    onSubmit: async (formProps, _, {accessToken, reset}) => {
        try {
            await dispatch(updateProductIfNeeded(formProps, accessToken));
        } catch (e) {
            dispatch(showNotification({message: e.message, variant: 'error'}));
        }
    },
});

export default connect(null, mapDispatchToProps)(EditProduct);
