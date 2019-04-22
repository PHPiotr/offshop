import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import CheckoutView from '../../components/Checkout';
import {connect} from 'react-redux';
import SubHeader from '../../components/SubHeader';
import ProgressIndicator from '../../components/ProgressIndicator';
import {setActiveStepId} from '../../actions/checkout';
import {resetOrderData} from '../../actions/order';

class Checkout extends Component {
    componentDidMount() {
        if (this.props.order.data.extOrderId) {
            this.props.resetOrderData();
        }
        if (!this.props.hasProductsInCart) {
            this.props.history.replace('/');
        }
    }

    componentWillReceiveProps(nextProps,nextContext) {
        if (nextProps.order.data.extOrderId) {
            if (nextProps.order.data.redirectUri) {
                window.location.href = nextProps.order.data.redirectUri;
            } else {
                this.props.setActiveStepId(0);
                this.props.history.replace('/order');
            }
        }
    }

    render() {
        return (
            <Fragment>
                {this.props.order.isCreating && <ProgressIndicator/>}
                <SubHeader content="Zamówienie"/>
                <CheckoutView />
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    order: state.order,
    hasProductsInCart: state.cart.ids.length > 0,
});

Checkout.propTypes = {
    order: PropTypes.shape({
        data: PropTypes.object,
        isCreating: PropTypes.bool,
    }).isRequired,
};

export default connect(mapStateToProps, {setActiveStepId, resetOrderData})(Checkout);
