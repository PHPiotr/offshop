import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import ProgressIndicator from '../../components/ProgressIndicator';
import OrderView from '../../components/Order';
import {resetIsCreated} from '../../actions/order';

const Order = props => {

    const {order, resetIsCreated} = props;

    useEffect(() => {
        resetIsCreated();
    }, []);

    useEffect(() => {
        if (!order.data.extOrderId) {
            props.history.replace('/');
        }
    }, [order.isCreating]);

    if (order.isCreating) {
        return <ProgressIndicator/>;
    }
    if (!order.data.extOrderId) {
        return <ProgressIndicator/>;
    }
    return <OrderView {...order.data}/>;
};

const mapStateToProps = state => ({
    order: state.order,
});

Order.propTypes = {
    order: PropTypes.shape({
        data: PropTypes.object,
        isCreating: PropTypes.bool,
    }).isRequired,
};

export default connect(mapStateToProps, {resetIsCreated})(Order);
