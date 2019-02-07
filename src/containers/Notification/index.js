import React, {Component} from 'react';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import io from 'socket.io-client';
import NotificationBar from '../../components/NotificationBar';

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
            // TODO: Decrease relevant amounts of products
            if (that.props.orderData.extOrderId === orderData.extOrderId && ['COMPLETED', 'CANCELED'].indexOf(orderData.status) > -1) {
                const variant = orderData.status === 'COMPLETED' ? 'success' : 'warning';
                that.setState({
                    message: that.props.intl.formatMessage({id: `order.notification.${orderData.status.toLowerCase()}`}),
                    open: true,
                    variant,
                });
            }
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

});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Notification));
