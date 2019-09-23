import React, {Fragment, useState} from 'react';
import {connect} from 'react-redux';
import ProductsView from '../../components/Products';
import {addToCart} from '../../actions/cart';
import {openDialog, closeDialog} from '../../actions/dialog';
import {getProductsIfNeeded} from '../../actions/products';
import ProductAddedToCartDialog from '../../components/Product/ProductAddedToCartDialog';
import RequestHandler from '../RequestHandler';

const Products = props => {

    const [sort, setSort] = useState('name');
    const [order, setOrder] = useState(1);
    const action = () => props.handleFetchProducts({sort, order})

    return (
        <RequestHandler action={action}>
            {() => (
                <Fragment>
                    <ProductsView {...props} />
                    <ProductAddedToCartDialog />
                </Fragment>
            )}
        </RequestHandler>
    );
};

const mapStateToProps = state => ({
    cart: state.cart,
    products: state.products.ids.map(i => state.products.data[i]),
    open: state.dialog.open,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    handleFetchProducts(params) {
        return dispatch(getProductsIfNeeded(params));
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
