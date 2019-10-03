import React, {Component} from 'react';
import {connect} from 'react-redux';
import NotificationBar from '../../components/NotificationBar';
import {syncQuantities} from '../../actions/products';
import {showNotification} from "../../actions/notification";
import io from '../../io';
const socket = io();

class Notification extends Component {

    componentDidMount() {
        const that = this;
        socket.on('order', function(orderData) {
            if (that.props.orderData.extOrderId === orderData.extOrderId && ['COMPLETED', 'CANCELED'].indexOf(orderData.status) > -1) {
                const variant = orderData.status === 'COMPLETED' ? 'success' : 'warning';
                that.props.handleShowNotification({
                    message: `order.notification.${orderData.status.toLowerCase()}`,
                    variant,
                });
            }
        });
        socket.on('quantities', function({productsIds, productsById}) {
            that.props.handleSyncQuantities(productsIds, productsById);
        });
    }

    render() {
        return <NotificationBar/>;
    }
}

const mapStateToProps = (state) => ({
    orderData: state.order.data || {},
    notification: state.notification,
});

const mapDispatchToProps = (dispatch) => ({
    handleSyncQuantities(productsIds, productsById) {
        dispatch(syncQuantities(productsIds, productsById));
    },
    handleShowNotification(payload) {
        dispatch(showNotification(payload));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
