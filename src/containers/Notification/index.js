import React, {Component} from 'react';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import io from 'socket.io-client';
import NotificationBar from '../../components/NotificationBar';
import {syncQuantities, onCreateProduct} from '../../actions/products';

const socket = io(process.env.REACT_APP_API_HOST);

class Notification extends Component {

    state = {
        message: '',
        open: false,
        variant: 'info',
    };

    componentDidMount() {
        const that = this;
        socket.on('order', function(orderData) {
            if (that.props.orderData.extOrderId === orderData.extOrderId && ['COMPLETED', 'CANCELED'].indexOf(orderData.status) > -1) {
                const variant = orderData.status === 'COMPLETED' ? 'success' : 'warning';
                that.setState({
                    message: that.props.intl.formatMessage({id: `order.notification.${orderData.status.toLowerCase()}`}),
                    open: true,
                    variant,
                });
            }
        });
        socket.on('quantities', function({productsIds, productsById}) {
            that.props.handleSyncQuantities(productsIds, productsById);
        });
        socket.on('createProduct', function(product) {
            that.props.handleOnCreateProduct(product);
        });
    }

    render() {
        return <NotificationBar message={this.state.message} open={this.state.open} variant={this.state.variant} />;
    }
}

const mapStateToProps = (state) => ({
    orderData: state.order.data || {},
});

const mapDispatchToProps = (dispatch) => ({
    handleSyncQuantities(productsIds, productsById) {
        dispatch(syncQuantities(productsIds, productsById));
    },
    handleOnCreateProduct(product) {
        dispatch(onCreateProduct(product));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Notification));
