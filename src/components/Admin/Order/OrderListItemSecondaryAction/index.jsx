import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {makeStyles} from '@material-ui/core';
import Cancel from './Cancel';
import Delete from './Delete';
import Refund from './Refund';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import {
    cancelOrderIfNeeded,
    deleteOrderIfNeeded,
    refundOrderIfNeeded
} from '../../../../actions/admin/order';

const useStyles = makeStyles(() => ({
    secondaryAction: {
        right: 0,
    },
}));

const OrderListItemSecondaryAction = props => {
    const {
        order,
        cancelOrderIfNeeded,
        deleteOrderIfNeeded,
        refundOrderIfNeeded,
    } = props;
    const classes = useStyles();

    return (
        <ListItemSecondaryAction className={classes.secondaryAction}>
            <Cancel order={order} cancelOrderIfNeeded={cancelOrderIfNeeded}/>
            <Delete order={order} deleteOrderIfNeeded={deleteOrderIfNeeded}/>
            <Refund order={order} refundOrderIfNeeded={refundOrderIfNeeded}/>
        </ListItemSecondaryAction>
    );
};

const mapDispatchToProps = {
    cancelOrderIfNeeded,
    deleteOrderIfNeeded,
    refundOrderIfNeeded,
};

OrderListItemSecondaryAction.propTypes = {
    cancelOrderIfNeeded: PropTypes.func.isRequired,
    deleteOrderIfNeeded: PropTypes.func.isRequired,
    refundOrderIfNeeded: PropTypes.func.isRequired,
};

export default withRouter(connect(null, mapDispatchToProps)(OrderListItemSecondaryAction));
