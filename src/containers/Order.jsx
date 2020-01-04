import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import ProgressIndicator from '../components/ProgressIndicator';
import OrderView from '../components/Order';

const Order = props => {
    if (props.order.isCreating) {
        return <ProgressIndicator/>;
    }
    return <OrderView {...props.order.data}/>;
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

export default connect(mapStateToProps)(Order);
