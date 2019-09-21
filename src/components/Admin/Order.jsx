import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Helmet} from 'react-helmet';
import {withRouter} from 'react-router-dom';
import {
    getOrderIfNeeded,
    cancelOrderIfNeeded,
    deleteOrderIfNeeded,
    refundOrderIfNeeded
} from '../../actions/admin/order';
import Card from '@material-ui/core/Card';
import {makeStyles} from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import RefundIcon from '@material-ui/icons/MoneyOff';
import CardActions from '@material-ui/core/CardActions';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Dialog from '../Dialog';
import RequestHandler from '../../containers/RequestHandler';

const useStyles = makeStyles(() => ({
    card: {
        maxWidth: `800px`,
        margin: '0 auto',
    },
    media: {
        height: 0,
        paddingTop: '75%', // 4:3
    },
    actions: {
        display: 'flex',
    },
}));

const cancelAllowedStatuses = ['NEW', 'PENDING', 'WAITING_FOR_CONFIRMATION', 'REJECTED'];
const deleteAllowedStatuses = ['LOCAL_NEW_INITIATED', 'LOCAL_NEW_REJECTED', 'LOCAL_NEW_COMPLETED'];
const refundAllowedStatuses = ['COMPLETED'];
const canCancelForStatus = status => cancelAllowedStatuses.indexOf(status) > -1;
const canDeleteForStatus = status => deleteAllowedStatuses.indexOf(status) > -1;
const canRefund = order => {
    if (refundAllowedStatuses.indexOf(order.status) === -1) {
        return false;
    }
    if (!order.refund) {
        return true;
    }
    if (order.refund.amount < order.totalAmount) {
        return true;
    }
};

const Order = props => {
    const classes = useStyles();
    const {order, getOrderIfNeeded, cancelOrderIfNeeded, deleteOrderIfNeeded, refundOrderIfNeeded} = props;
    const action = () => getOrderIfNeeded(props.match.params.id);

    const [isCancelOrderDialogOpen, setIsCancelOrderDialogOpen] = useState(false);
    const [isDeleteOrderDialogOpen, setIsDeleteOrderDialogOpen] = useState(false);
    const [isRefundOrderDialogOpen, setIsRefundOrderDialogOpen] = useState(false);

    const handleCancelOrderClick = () => setIsCancelOrderDialogOpen(true);
    const hideCancelOrderDialog = () => setIsCancelOrderDialogOpen(false);
    const handleCancelOrder = () => {
        setIsCancelOrderDialogOpen(false);
        cancelOrderIfNeeded(order.extOrderId, order.status);
    };

    const handleDeleteOrderClick = () => setIsDeleteOrderDialogOpen(true);
    const hideDeleteOrderDialog = () => setIsDeleteOrderDialogOpen(false);
    const handleDeleteOrder = async () => {
        setIsDeleteOrderDialogOpen(false);
        try {
            await deleteOrderIfNeeded(order.extOrderId);
            props.history.replace('/admin/orders/list');
        } catch {
        }
    };

    const canRefundOrder = canRefund(order);
    const handleRefundOrderClick = () => {
        if (canRefundOrder) {
            setIsRefundOrderDialogOpen(true);
        }
    };
    const hideRefundOrderDialog = () => setIsRefundOrderDialogOpen(false);
    const handleRefundOrder = async () => {
        if (canRefundOrder) {
            setIsRefundOrderDialogOpen(false);
            refundOrderIfNeeded(order.extOrderId, order.totalAmount);
        }
    };

    return (
        <RequestHandler action={action}>
            {() => (
                <Fragment>
                    <Helmet>
                        <title>{order.description}</title>
                    </Helmet>
                    <Card className={classes.card}>
                        <CardHeader
                            title={order.description}
                            subheader={new Date(order.localReceiptDateTime || order.orderCreateDate).toLocaleString('pl')}
                        />
                        <CardContent>
                            <Typography component="p">
                                {order.orderId}
                            </Typography>
                            <Typography component="p">
                                {order.status}
                            </Typography>
                        </CardContent>
                        <CardActions className={classes.actions}>
                            {canCancelForStatus(order.status) && (<Tooltip title="Anuluj zamówienie">
                                <IconButton aria-label="Anuluj zamówienie" onClick={handleCancelOrderClick}>
                                    <CancelIcon color="error"/>
                                </IconButton>
                            </Tooltip>)}
                            {canDeleteForStatus(order.status) && (<Tooltip title="Usuń zamówienie">
                                <IconButton aria-label="Usuń zamówienie" onClick={handleDeleteOrderClick}>
                                    <DeleteIcon color="error"/>
                                </IconButton>
                            </Tooltip>)}
                            <Tooltip
                                title={canRefundOrder ? 'Zwróć zamówienie' : 'Nie można wykonać zwrotu zamówienia'}>
                                <IconButton
                                    aria-label={canRefundOrder ? 'Zwróć zamówienie' : 'Nie można wykonać zwrotu zamówienia'}
                                    onClick={handleRefundOrderClick}>
                                    <RefundIcon color={canRefundOrder ? 'error' : 'disabled'}/>
                                </IconButton>
                            </Tooltip>
                        </CardActions>
                    </Card>
                    <Dialog
                        title={`Anulować zamówienie?`}
                        content={order.description}
                        onClose={hideCancelOrderDialog}
                        open={isCancelOrderDialogOpen}
                        actions={[
                            <Button key="0" color="primary" onClick={hideCancelOrderDialog}>Nie</Button>,
                            <Button key="1" color="primary" onClick={handleCancelOrder}>Tak</Button>,
                        ]}
                    />
                    <Dialog
                        title={`Usunąć zamówienie?`}
                        content={order.description}
                        onClose={hideDeleteOrderDialog}
                        open={isDeleteOrderDialogOpen}
                        actions={[
                            <Button key="0" color="primary" onClick={hideDeleteOrderDialog}>Nie</Button>,
                            <Button key="1" color="primary" onClick={handleDeleteOrder}>Tak</Button>,
                        ]}
                    />
                    <Dialog
                        title={`Wykonać zwrot środków na konto kupującego?`}
                        content={order.description}
                        onClose={hideRefundOrderDialog}
                        open={isRefundOrderDialogOpen}
                        actions={[
                            <Button key="0" color="primary" onClick={hideRefundOrderDialog}>Nie</Button>,
                            <Button key="1" color="primary" onClick={handleRefundOrder}>Tak</Button>,
                        ]}
                    />
                </Fragment>
            )}
        </RequestHandler>
    );
};

const mapStateToProps = state => ({
    order: state.adminOrder.data[state.adminOrder.id] || {},
    isFetching: state.adminOrder.isFetching,
});
const mapDispatchToProps = {
    cancelOrderIfNeeded,
    deleteOrderIfNeeded,
    getOrderIfNeeded,
    refundOrderIfNeeded,
};

Order.propTypes = {
    cancelOrderIfNeeded: PropTypes.func.isRequired,
    deleteOrderIfNeeded: PropTypes.func.isRequired,
    getOrderIfNeeded: PropTypes.func.isRequired,
    refundOrderIfNeeded: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Order));
