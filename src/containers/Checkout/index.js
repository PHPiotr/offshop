import React, {Component, Fragment} from 'react';
import CheckoutView from '../../components/Checkout';
import {connect} from 'react-redux';
import {stepBack, stepNext} from '../../actions/checkout';
import SubHeader from "../../components/SubHeader";

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
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
