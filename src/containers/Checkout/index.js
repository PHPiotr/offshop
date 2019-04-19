import React, {Component, Fragment} from 'react';
import CheckoutView from '../../components/Checkout';
import {connect} from 'react-redux';
import SubHeader from '../../components/SubHeader';
import ProgressIndicator from '../../components/ProgressIndicator';
import {setActiveStepId} from '../../actions/checkout';
import {resetOrderData} from '../../actions/order';
import {showNotification} from '../../actions/notification';

class Checkout extends Component {
    componentDidMount() {
        if (this.props.orderData.extOrderId) {
            this.props.resetOrderData();
        }
        if (!this.props.hasProductsInCart) {
            this.props.history.replace('/');
        }
    }

    componentWillReceiveProps(nextProps,nextContext) {
        if (nextProps.orderData.extOrderId) {
            if (nextProps.orderData.redirectUri) {
                window.location.href = nextProps.orderData.redirectUri;
            } else {
                this.props.setActiveStepId(0);
                this.props.history.replace('/order');
            }
        }
        if (nextProps.orderError) {
            this.props.setActiveStepId(2);
            this.props.showNotification({message: nextProps.orderError, variant: 'error'});
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
    orderData: state.order.data || {},
    orderError: state.order.error || '',
    hasProductsInCart: state.cart.ids.length > 0,
    isCreatingOrder: state.order.isCreating,
});

export default connect(mapStateToProps, {setActiveStepId, resetOrderData, showNotification})(Checkout);
