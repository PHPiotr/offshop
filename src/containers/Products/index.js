import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import ProductsView from '../../components/Products';
import {addToCart} from '../../actions/cart';
import {openDialog, closeDialog} from '../../actions/dialog';
import {getProductsIfNeeded} from '../../actions/products';
import ProductAddedToCartDialog from '../../components/Product/ProductAddedToCartDialog';

class Products extends Component {
    componentDidMount() {
        this.props.handleFetchProducts();
    }

    render() {
        return (
            <Fragment>
                <ProductsView {...this.props} />
                <ProductAddedToCartDialog />
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    cart: state.cart,
    products: state.products.ids.map(i => state.products.data[i]),
    open: state.dialog.open,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    handleFetchProducts() {
        dispatch(getProductsIfNeeded());
    },
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

export default connect(mapStateToProps, mapDispatchToProps)(Products);
