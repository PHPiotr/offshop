import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {createProductIfNeeded} from "../../../../modules/Products/actions";
import {showNotification} from "../../../../actions/notification";
import ProductForm from './ProductForm';
import SubHeader from '../../../../components/SubHeader';

let AddProduct = props => (
    <>
        <SubHeader content="Dodaj produkt"/>
        <ProductForm {...props}/>
    </>
);

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: async (formProps, _, {accessToken, reset}) => {
        try {
            await dispatch(createProductIfNeeded(formProps, accessToken));
            ownProps.history.push('/admin/products/list');
        } catch (e) {
            dispatch(showNotification({message: e.message, variant: 'error'}));
        }
    },
});

export default withRouter(connect(null, mapDispatchToProps)(AddProduct));
