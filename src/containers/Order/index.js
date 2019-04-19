import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import ProgressIndicator from '../../components/ProgressIndicator';
import OrderView from '../../components/Order';

class Order extends Component {

    componentDidMount() {
        if (!this.props.order.data.extOrderId) {
            this.props.history.replace('/');
        }
    }

    render() {
        if (this.props.order.isCreating) {
            return <ProgressIndicator/>;
        }
        if (!this.props.order.data.extOrderId) {
            return null;
        }
        return <OrderView extOrderId={this.props.order.data.extOrderId}/>;
    }
}

const mapStateToProps = state => ({
    order: state.order,
});

Order.propTypes = {
    order: PropTypes.shape({
        data: PropTypes.object,
        isCreating: PropTypes.bool,
    }).isRequired,
};

export default connect(mapStateToProps)(Order);
