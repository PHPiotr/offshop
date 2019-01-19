import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import CartProducts from '../../components/Cart/Products';
import CartSummary from '../../components/Cart/Summary';
import SubHeader from '../../components/SubHeader';
import { addToCart, removeFromCart } from '../../actions/cart';
import { setCurrentSupplier } from '../../actions/suppliers';

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
    products: state.products.ids.map(i => state.products.data[i]).filter(p => p.inCart > 0),
    suppliers: state.suppliers.ids.map(i => state.suppliers.data[i]),
    currentSupplier: state.suppliers.data[state.suppliers.currentId],
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    incrementItemInCart(item) {
        dispatch(addToCart(item));
    },
    decrementItemInCart(item) {
        dispatch(removeFromCart(item));
    },
    removeItemFromCart(item) {
        dispatch(removeFromCart(item, item.inCart));
    },
    setCurrentSupplier(supplier) {
        dispatch(setCurrentSupplier(supplier));
    },
    checkout() {
        ownProps.history.push('/checkout');
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Cart);
