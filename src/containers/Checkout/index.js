import React, {Component, Fragment} from 'react';
import CheckoutView from '../../components/Checkout';
import {connect} from 'react-redux';
import SubHeader from '../../components/SubHeader';
import ProgressIndicator from '../../components/ProgressIndicator';

class Checkout extends Component {
    componentDidMount() {
        if (!this.props.hasProductsInCart) {
            this.props.redirectToCart();
        }
    }

    render() {
        return (
            <Fragment>
                {this.props.isCreatingOrder && <ProgressIndicator/>}
                <SubHeader content="Zamówienie"/>
                <CheckoutView />
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    hasProductsInCart: state.cart.ids.length > 0,
    isCreatingOrder: state.order.isCreating,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    redirectToCart() {
        ownProps.history.replace('/cart');
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
