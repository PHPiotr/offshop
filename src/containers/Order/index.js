import React, {Component} from 'react';
import {connect} from "react-redux";
import ProgressIndicator from '../../components/ProgressIndicator';
import OrderView from '../../components/Order';

class Order extends Component {

    componentDidMount() {
        if (!this.props.orderData.extOrderId) {
            this.props.history.replace('/');
        }
    }

    render() {
        const {orderData: {extOrderId}, isCreatingOrder} = this.props;
        if (!extOrderId) {
            return null;
        }
        if (isCreatingOrder) {
            return <ProgressIndicator/>;
        }
        return <OrderView extOrderId={extOrderId}/>;
    }
}

const mapStateToProps = state => ({
    orderData: state.order.data || {},
    isCreatingOrder: state.order.isCreating,
});

export default connect(mapStateToProps)(Order);
