import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Helmet} from 'react-helmet';
import {getOrderIfNeeded, cancelOrderIfNeeded} from '../../actions/admin/order';
import ProgressIndicator from '../ProgressIndicator';
import Card from '@material-ui/core/Card';
import {makeStyles} from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
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

const noCancelStatuses = ['COMPLETED', 'CANCELED'];
const canCancelForStatus = status => noCancelStatuses.indexOf(status) === -1;

const Order = props => {
    const classes = useStyles();
    const {order, getOrderIfNeeded, cancelOrderIfNeeded} = props;
    useEffect(() => {
        if (props.match.params.id) {
            getOrderIfNeeded(props.match.params.id);
        }
    }, [props.match.params.id]);
    const [isCancelOrderDialogOpen, setIsCancelOrderDialogOpen] = useState(false);

    const handleCancelOrderClick = () => {
        setIsCancelOrderDialogOpen(true);
    };

    const hideCancelOrderDialog = () => {
        setIsCancelOrderDialogOpen(false);
    };

    const handleCancelOrder = () => {
        setIsCancelOrderDialogOpen(false);
        cancelOrderIfNeeded(order.extOrderId, order.status);
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
};

Order.propTypes = {
    getAdminOrderIfNeeded: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Order);
