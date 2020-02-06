import React, {Fragment, useState} from 'react';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '../../../../components/Dialog';
import {showNotification} from '../../../../actions/notification';

const cancelAllowedStatuses = ['NEW', 'PENDING', 'WAITING_FOR_CONFIRMATION', 'REJECTED'];
const canCancelForStatus = status => cancelAllowedStatuses.indexOf(status) > -1;

const OrderDialogCancel = props => {
    const {order, cancelOrderIfNeeded} = props;
    const [isCancelOrderDialogOpen, setIsCancelOrderDialogOpen] = useState(false);
    const handleCancelOrderClick = () => setIsCancelOrderDialogOpen(true);
    const hideCancelOrderDialog = () => setIsCancelOrderDialogOpen(false);
    const handleCancelOrder = async () => {
        setIsCancelOrderDialogOpen(false);
        try {
            await cancelOrderIfNeeded(order.extOrderId, order.status);
        } catch (e) {
            props.showNotification({
                message: e.message,
                variant: 'error',
            });
        }
    };
    if (!canCancelForStatus(order.status)) {
        return null;
    }
    return (
        <Fragment>
            <Tooltip title="Anuluj zamówienie">
                <IconButton aria-label="Anuluj zamówienie" onClick={handleCancelOrderClick}>
                    <CancelIcon color="error"/>
                </IconButton>
            </Tooltip>
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

export default connect(null, {showNotification})(OrderDialogCancel);
