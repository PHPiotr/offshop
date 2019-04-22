import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import ProductsView from '../../components/Products';
import Dialog from '../../components/Dialog';
import {addToCart} from '../../actions/cart';
import {openDialog, closeDialog} from '../../actions/dialog';
import {getProductsIfNeeded} from '../../actions/products';
import {FormattedMessage} from 'react-intl';
import Button from '@material-ui/core/Button';

class Products extends Component {
    componentDidMount() {
        this.props.handleFetchProducts();
    }

    render() {
        return (
            <Fragment>
                <ProductsView {...this.props} />
                <Dialog
                    open={this.props.open}
                    onClose={this.props.continueShopping}
                    title={<FormattedMessage id="products.product_added_to_cart"/>}
                    actions={
                        [
                            <Button key="1" onClick={this.props.continueShopping} color="primary">
                                <FormattedMessage id="products.continue_shopping"/>
                            </Button>,
                            <Button key="2" onClick={this.props.goToCart} color="primary">
                                <FormattedMessage id="products.go_to_cart"/>
                            </Button>,
                        ]
                    }
                />
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    cart: state.cart,
    category: state.categories.items.find(c => c.id === state.categories.currentId),
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
