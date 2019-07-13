import React from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import {FormattedMessage} from 'react-intl';
import Dialog from '../../components/Dialog';
import {addToCart} from '../../actions/cart';
import {openDialog, closeDialog} from '../../actions/dialog';

const ProductAddedToCartDialog = props => (
    <Dialog
        role="ProductAddedToCartDialog"
        open={props.open}
        onClose={props.continueShopping}
        title={<FormattedMessage id="products.product_added_to_cart"/>}
        actions={
            [
                <Button key="1" onClick={props.continueShopping} color="primary">
                    <FormattedMessage id="products.continue_shopping"/>
                </Button>,
                <Button key="2" onClick={props.goToCart} color="primary">
                    <FormattedMessage id="products.go_to_cart"/>
                </Button>,
            ]
        }
    />
);

ProductAddedToCartDialog.propTypes = {
    open: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    open: state.dialog.open,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    addToCart(item, quantity) {
        dispatch(addToCart(item, quantity));
        dispatch(openDialog());
    },
    goToCart() {
        dispatch(closeDialog());
        ownProps.history.push('/cart');
    },
    continueShopping() {
        dispatch(closeDialog());
    },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductAddedToCartDialog));
