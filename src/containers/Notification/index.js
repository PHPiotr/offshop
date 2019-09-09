import React, {Component} from 'react';
import {connect} from 'react-redux';
import io from 'socket.io-client';
import NotificationBar from '../../components/NotificationBar';
import {syncQuantities, onCreateProduct, onUpdateProduct, onDeleteProduct} from '../../actions/products';
import {showNotification} from "../../actions/notification";

const socket = io(process.env.REACT_APP_API_HOST);

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
        socket.on('createProduct', function(product) {
            that.props.handleOnCreateProduct(product);
            that.props.handleShowNotification({
                message: 'Dodano nowy produkt',
                variant: 'success',
            });
        });
        socket.on('updateProduct', function(product) {
            that.props.handleOnUpdateProduct(product);
            that.props.handleShowNotification({
                message: 'Zmodyfikowano produkt',
                variant: 'success',
            });
        });
        socket.on('deleteProduct', function(product) {
            that.props.handleOnDeleteProduct(product);
            that.props.handleShowNotification({
                message: 'Usunięto produkt',
                variant: 'warning',
            });
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
    handleOnCreateProduct(product) {
        dispatch(onCreateProduct(product));
    },
    handleOnUpdateProduct(product) {
        dispatch(onUpdateProduct(product));
    },
    handleOnDeleteProduct(product) {
        dispatch(onDeleteProduct(product));
    },
    handleShowNotification(payload) {
        dispatch(showNotification(payload));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
