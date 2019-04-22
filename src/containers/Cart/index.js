import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import CartProducts from '../../components/Cart/Products';
import CartSummary from '../../components/Cart/Summary';
import SubHeader from '../../components/SubHeader';
import { addToCart, decrementInCart, deleteFromCart } from '../../actions/cart';
import { setCurrentSupplier } from '../../actions/suppliers';
import {requireBuyerDeliveryStep, skipBuyerDeliveryStep} from '../../actions/buyerDelivery';

class Cart extends Component {
    render() {
        if (!this.props.products.length) {
            return <SubHeader content="Koszyk jest pusty" />;
        }
        return (
            <Fragment>
                <SubHeader content="Koszyk" />
                <CartProducts {...this.props} />
                <CartSummary {...this.props} />
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    cart: state.cart,
    products: state.cart.ids.map(i => state.products.data[i]),
    suppliers: state.suppliers.ids.map(i => state.suppliers.data[i]),
    currentSupplier: state.suppliers.data[state.suppliers.currentId],
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    incrementItemInCart(item) {
        dispatch(addToCart(item));
    },
    decrementItemInCart(item) {
        dispatch(decrementInCart(item));
    },
    removeItemFromCart(itemId) {
        dispatch(deleteFromCart(itemId));
    },
    setCurrentSupplier(supplier) {
        dispatch(setCurrentSupplier(supplier));
    },
    toggleBuyerDeliveryStepRequired(required) {
        if (required) {
            dispatch(requireBuyerDeliveryStep());
        } else {
            dispatch(skipBuyerDeliveryStep());
        }
    },
    checkout() {
        ownProps.history.push('/checkout');
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Cart);
