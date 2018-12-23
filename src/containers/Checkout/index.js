import React, {Component, Fragment} from 'react';
import CheckoutView from '../../components/Checkout';
import {connect} from 'react-redux';
import {stepBack, stepNext} from '../../actions/checkout';
import {createOrder} from '../../actions/order';
import SubHeader from '../../components/SubHeader';
import withGooglePay from '../../hoc/withGooglePay';

class Checkout extends Component {
    componentDidMount() {
        if (!this.props.supplier.id || !this.props.cart.amount) {
            this.props.redirectToCart();
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
    activeStep: state.checkout.activeStep,
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
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    handleNext() {
        dispatch(stepNext());
    },
    handleBack() {
        dispatch(stepBack());
    },
    redirectToCart() {
        ownProps.history.replace('/cart');
    },
    onGooglePayButtonClick(paymentDataFromGooglePay) {
        dispatch(createOrder(paymentDataFromGooglePay))
            .then(payload => {
                const {redirectUri} = payload;
                if (!redirectUri) {
                    throw Error('Missing redirect uri');
                }
                window.location.href = redirectUri;
            })
            .catch(error => console.error(error));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(withGooglePay(Checkout));
