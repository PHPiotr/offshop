import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Helmet} from 'react-helmet';
import {withRouter} from 'react-router-dom';
import {getOrderIfNeeded, cancelOrderIfNeeded, deleteOrderIfNeeded} from '../../actions/admin/order';
import ProgressIndicator from '../ProgressIndicator';
import Card from '@material-ui/core/Card';
import {makeStyles} from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import CardActions from '@material-ui/core/CardActions';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Dialog from '../Dialog';

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
const canCancelForStatus = status => cancelAllowedStatuses.indexOf(status) > -1;
const canDeleteForStatus = status => deleteAllowedStatuses.indexOf(status) > -1;

const Order = props => {
    const classes = useStyles();
    const {order, getOrderIfNeeded, cancelOrderIfNeeded, deleteOrderIfNeeded} = props;
    useEffect(() => {
        if (props.match.params.id) {
            getOrderIfNeeded(props.match.params.id);
        }
    }, [props.match.params.id]);
    const [isCancelOrderDialogOpen, setIsCancelOrderDialogOpen] = useState(false);
    const [isDeleteOrderDialogOpen, setIsDeleteOrderDialogOpen] = useState(false);

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
        } catch {}
    };

    return (
        <Fragment>
            {props.isFetching && <ProgressIndicator />}
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
        </Fragment>
    );
};

const mapStateToProps = state => ({
    order: state.adminOrder.data[state.adminOrder.id] || {},
    isFetching: state.adminOrder.isFetching,
});
const mapDispatchToProps = {
    getOrderIfNeeded,
    cancelOrderIfNeeded,
    deleteOrderIfNeeded,
};

Order.propTypes = {
    getOrderIfNeeded: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Order));
