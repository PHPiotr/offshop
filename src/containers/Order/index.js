import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import ProgressIndicator from '../../components/ProgressIndicator';
import OrderView from '../../components/Order';
import {resetIsCreated} from '../../actions/order';

const Order = props => {

    const {order, resetIsCreated, isCreating} = props;

    useEffect(() => {
        resetIsCreated();
    }, []);

    if (isCreating) {
        return <ProgressIndicator/>;
    }
    return <OrderView {...order.data}/>;
};

const mapStateToProps = state => ({
    order: state.order,
    isCreating: state.order.isCreating,
});

Order.propTypes = {
    order: PropTypes.shape({
        data: PropTypes.object,
        isCreating: PropTypes.bool,
    }).isRequired,
    isCreating: PropTypes.bool,
};

export default connect(mapStateToProps, {resetIsCreated})(Order);
