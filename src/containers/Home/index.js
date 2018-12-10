import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import Products from '../../components/Products';
import AddedToCartDialog from '../../components/Dialog/AddedToCart';
import {addToCart, removeFromCart} from "../../actions/cart";
import {openAddedToCartDialog, closeAddedToCartDialog} from "../../actions/addedToCartDialog";

class Home extends Component {
    render() {
        return (
            <Fragment>
                <Products {...this.props} />
                <AddedToCartDialog
                    open={this.props.addedToCartDialog.open}
                    onContinueShoppingClick={this.props.continueShopping}
                    onGoToCartClick={this.props.goToCart}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    category: state.categories.items.find(c => c.id === state.categories.currentId),
    products: state.products.items.filter(p => p.categoryId === state.categories.currentId),
    addedToCartDialog: state.addedToCartDialog,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    addToCart(item, amount) {
        dispatch(addToCart(item, amount));
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
