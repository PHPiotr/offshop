import React, {Component, Fragment} from 'react';
import CheckoutView from '../../components/Checkout';
import {connect} from 'react-redux';
import {stepBack, stepNext, setActiveStep} from '../../actions/checkout';
import {createOrder, retrieveOrder, setOrderData} from '../../actions/order';
import SubHeader from '../../components/SubHeader';
import withGooglePay from '../../hoc/withGooglePay';

const ORDER_DATA = 'orderData';
const COMPLETED = 'COMPLETED';

class Checkout extends Component {
    componentDidMount() {
        try {
            const orderDataFromStorage = localStorage.getItem(ORDER_DATA);
            if (orderDataFromStorage) {
                const orderData = JSON.parse(orderDataFromStorage);
                this.props.handleRestoreOrderData(orderData);
                this.props.handleRestoreActiveStep(this.props.steps.length);
                this.props.syncOrderData(orderData.extOrderId);
                localStorage.removeItem(ORDER_DATA);
                return;
            }
        } catch (e) {
            console.log('localStorage not available: ', e);
        }

        if (!this.props.supplier.id || !this.props.cart.amount) {
            this.props.redirectToCart();
        }
    }

    componentWillUnmount() {
        if (this.props.orderData) {
            this.props.handleRestoreOrderData(null);
            this.props.handleRestoreActiveStep(0);
        }
    }

    render() {
        return (
            <Fragment>
                <SubHeader content="Zamówienie"/>
                <CheckoutView {...this.props} />
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    activeStep: state.checkout.activeStep || 0,
    steps: state.checkout.steps,
    supplier: state.suppliers.current,
    cart: state.cart,
    totalPrice: state.cart.totalPrice + state.suppliers.current.pricePerUnit * state.cart.units,
    products: state.products.items.filter(p => p.inCart > 0),
    shipping: state.shipping,
    validShippingData: !state.shipping.itemIds.reduce((acc, i) => {
        const {value, required} = state.shipping.items[i];
        if (required && (typeof value !== 'string' || !value.trim())) {
            acc++;
        }
        return acc;
    }, 0),
    buyer: {
        email: state.shipping.items.email.value,
        phone: state.shipping.items.phone.value,
        firstName: state.shipping.items.firstName.value,
        lastName: state.shipping.items.lastName.value,
        language: 'pl',
    },
    orderData: state.order.data,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    handleNext() {
        dispatch(stepNext());
    },
    handleBack() {
        dispatch(stepBack());
    },
    handleRestoreActiveStep(activeStep) {
        dispatch(setActiveStep(activeStep));
    },
    redirectToCart() {
        ownProps.history.replace('/cart');
    },
    async onGooglePayButtonClick(paymentDataFromGooglePay) {
        try {
            const payload = await dispatch(createOrder(paymentDataFromGooglePay));
            const {redirectUri, extOrderId} = payload;
            if (redirectUri) {
                try {
                    localStorage.setItem(ORDER_DATA, JSON.stringify(payload));
                } catch (e) {
                    console.log('localStorage not available: ', e);
                }
                window.location.href = redirectUri;
            } else {
                dispatch(stepNext());
                const {status} = await dispatch(retrieveOrder(extOrderId));
                if (status !== COMPLETED) {
                    console.log('order status is: ', status);
                }
            }
        } catch (error) {
            console.error(error);
        }
    },
    handleRestoreOrderData(orderData) {
        dispatch(setOrderData(orderData));
    },
    async syncOrderData(extOrderId) {
        try {
            const {status} = await dispatch(retrieveOrder(extOrderId));
            if (status !== COMPLETED) {
                console.log('order status is: ', status);
            }
        } catch (error) {
            console.error(error);
        }
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(withGooglePay(Checkout));
