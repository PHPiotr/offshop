import React from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from './Dialog';
import {addToCart} from '../actions/cart';
import {openDialog, closeDialog} from '../actions/dialog';

const ProductAddedToCartDialog = props => props.open ? (
    <Dialog
        open={props.open}
        onClose={props.continueShopping}
        title="Produkt został dodany do koszyka."
        actions={
            [
                <Button data-testid="btn-continue" key="1" onClick={props.continueShopping} color="primary">
                    Kontynuuj zakupy
                </Button>,
                <Button data-testid="btn-cart" key="2" onClick={props.goToCart} color="primary">
                    Przejdź do koszyka
                </Button>,
            ]
        }
    />
) : null;

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
