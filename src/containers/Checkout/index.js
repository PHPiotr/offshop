import React, {Component, Fragment} from 'react';
import CheckoutView from '../../components/Checkout';
import {connect} from 'react-redux';
import SubHeader from '../../components/SubHeader';
import ProgressIndicator from '../../components/ProgressIndicator';

class Checkout extends Component {
    componentDidMount() {
        if (!this.props.deliveryMethodId) {
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
    deliveryMethodId: state.deliveryMethods.currentId,
    isCreatingOrder: state.order.isCreating,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    redirectToCart() {
        ownProps.history.replace('/cart');
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
