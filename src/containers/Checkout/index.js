import React, {Component, Fragment} from 'react';
import CheckoutView from '../../components/Checkout';
import {connect} from 'react-redux';
import SubHeader from '../../components/SubHeader';
import ProgressIndicator from '../../components/ProgressIndicator';
import {setActiveStepId} from '../../actions/checkout';

class Checkout extends Component {
    componentDidMount() {
        if (!this.props.hasProductsInCart) {
            this.props.redirectToCart();
        }
    }

    componentWillReceiveProps(nextProps,nextContext) {
        if (nextProps.orderData) {
            debugger;
            if (nextProps.orderData.redirectUri) {
                window.location.href = nextProps.orderData.redirectUri;
            } else {
                this.props.setActiveStepId(0);
                nextProps.history.replace('/order');
            }
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
    order: state.order,
    orderData: state.order.data,
    hasProductsInCart: state.cart.ids.length > 0,
    isCreatingOrder: state.order.isCreating,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    redirectToCart() {
        ownProps.history.replace('/cart');
    },
    setActiveStepId(step) {
        dispatch(setActiveStepId(step));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
