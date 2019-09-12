import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import CartProducts from '../../components/Cart/Products';
import CartSummary from '../../components/Cart/Summary';
import {getDeliveryMethodsIfNeeded} from '../../actions/deliveryMethods';

class Cart extends Component {

    componentDidMount() {
        this.props.handleGetDeliveryMethodsIfNeeded();
    }

    render() {
        if (!this.props.products.length) {
            return null;
        }
        return (
            <Fragment>
                <CartProducts/>
                <CartSummary/>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    cart: state.cart,
    products: state.cart.ids.map(i => state.products.data[i]),
    deliveryMethods: state.deliveryMethods.ids.map(i => state.deliveryMethods.data[i]),
    currentDeliveryMethod: state.deliveryMethods.data[state.deliveryMethods.currentId] || {},
});

const mapDispatchToProps = dispatch => ({
    handleGetDeliveryMethodsIfNeeded() {
        dispatch(getDeliveryMethodsIfNeeded());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
