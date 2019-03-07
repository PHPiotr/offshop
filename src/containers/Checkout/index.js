import React, {Component, Fragment} from 'react';
import {getFormValues, isValid} from 'redux-form';
import CheckoutView from '../../components/Checkout';
import {connect} from 'react-redux';
import {stepBack, stepNext, setActiveStepId, toggleCreateOrderFailedDialog} from '../../actions/checkout';
import {createOrder} from '../../actions/order';
import SubHeader from '../../components/SubHeader';
import OrderCreateFailedDialog from '../../components/Checkout/OrderCreateFailedDialog';
import withGooglePay from '../../hoc/withGooglePay';

class Checkout extends Component {
    componentDidMount() {
        if (!this.props.deliveryMethod.id || !this.props.cart.quantity) {
            this.props.redirectToCart();
        }
    }

    render() {
        return (
            <Fragment>
                <SubHeader content="Zamówienie"/>
                <CheckoutView {...this.props} />
                <OrderCreateFailedDialog/>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    activeStepId: state.checkout.activeStepId || 0,
    stepsIds: state.checkout.stepsIds,
    steps: state.checkout.steps,
    deliveryMethod: state.deliveryMethods.data[state.deliveryMethods.currentId],
    cart: state.cart,
    totalPrice: state.cart.totalPrice + state.deliveryMethods.data[state.deliveryMethods.currentId].unitPrice * state.cart.quantity,
    products: state.cart.ids.map(i => state.products.data[i]),
    shipping: state.shipping,
    validBuyerData: isValid('buyer')(state),
    validBuyerDeliveryData: isValid('buyerDelivery')(state),
    buyer: getFormValues('buyer')(state),
    buyerDelivery: getFormValues('buyerDelivery')(state),
    orderData: state.order.data,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    handleNext() {
        dispatch(stepNext());
    },
    handleBack() {
        dispatch(stepBack());
    },
    handleRestoreActiveStepId(activeStepId) {
        dispatch(setActiveStepId(activeStepId));
    },
    redirectToCart() {
        ownProps.history.replace('/cart');
    },
    async onGooglePayButtonClick(paymentDataFromGooglePay) {
        try {
            const payload = await dispatch(createOrder(paymentDataFromGooglePay));
            const {redirectUri} = payload;
            if (redirectUri) {
                window.location.href = redirectUri;
            } else {
                dispatch(setActiveStepId(0));
                ownProps.history.replace('/order');
            }
        } catch (orderError) {
            dispatch(toggleCreateOrderFailedDialog());
        }
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(withGooglePay(Checkout));
