import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import ProductsView from '../../components/Products';
import AddedToCartDialog from '../../components/Dialog/AddedToCart';
import {addToCart, removeFromCart} from '../../actions/cart';
import {
    openAddedToCartDialog,
    closeAddedToCartDialog,
} from '../../actions/addedToCartDialog';
import {getProductsIfNeeded} from "../../actions/products";

class Products extends Component {
    componentDidMount() {
        this.props.handleFetchProducts();
    }

    render() {
        return (
            <Fragment>
                <ProductsView {...this.props} />
                <AddedToCartDialog
                    open={this.props.addedToCartDialog.open}
                    onContinueShoppingClick={this.props.continueShopping}
                    onGoToCartClick={this.props.goToCart}
                />
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    cart: state.cart,
    category: state.categories.items.find(c => c.id === state.categories.currentId),
    products: state.products.ids.map(i => state.products.data[i]),
    addedToCartDialog: state.addedToCartDialog,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    handleFetchProducts() {
        dispatch(getProductsIfNeeded());
    },
    addToCart(item, quantity) {
        dispatch(addToCart(item, quantity));
        dispatch(openAddedToCartDialog());
    },
    removeFromCart(e, amount, units) {
        dispatch(removeFromCart(e.currentTarget.id, amount, units));
    },
    goToCart() {
        dispatch(closeAddedToCartDialog());
        ownProps.history.push('/cart');
    },
    continueShopping() {
        dispatch(closeAddedToCartDialog());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Products);
