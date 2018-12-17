import React, {Component, Fragment} from 'react';
import CheckoutView from '../../components/Checkout';
import {connect} from 'react-redux';
import {stepBack, stepNext} from '../../actions/checkout';
import SubHeader from "../../components/SubHeader";
import withGooglePay from '../../hoc/withGooglePay';
import {authorize, createOrder} from '../../api/payu';

const onPaymentDataReceived = (paymentData, totalAmount, products) => {
    const {paymentMethodData} = paymentData;
    authorize().then(response => {
        if (!response.ok) {
            throw Error('Something went wrong');
        }
        return response.json();
    }).then(json => {
        const {access_token} = json;
        createOrder(
            access_token,
            btoa(paymentMethodData.tokenizationData.token),
            totalAmount,
            products,
            paymentMethodData.description
        ).then((response) => {
            if (!response.ok) {
                throw Error('Something went wrong');
            }
            return response.json();
        }).then((orderData) => {
            const {orderId, redirectUri, status} = orderData;
            console.log(orderId, redirectUri, status);
            window.location.href = redirectUri;
        }).catch(e => console.log(e));
    });
};

class Checkout extends Component {

    componentDidMount() {
        if (!this.props.supplier.id || !this.props.cart.amount) {
            this.props.redirectToCart();
        }
    }

    render() {
        return (
            <Fragment>
                <SubHeader content="Zamówienie" />
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
    onGooglePayButtonClick: (paymentData, props) => {
        console.log(paymentData);
        const {totalPrice, products} = props;
        onPaymentDataReceived(
            paymentData,
            parseFloat(totalPrice).toFixed(2).toString().replace('.', ''),
            products.map(({title, price, inCart}) => ({
                name: title,
                unitPrice: parseFloat(price).toFixed(2).toString().replace('.', ''),
                quantity: inCart.toString(),
            })),
        );
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(withGooglePay(Checkout));
