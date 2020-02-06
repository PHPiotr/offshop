import React, {Fragment, useState} from 'react';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RefundIcon from '@material-ui/icons/MoneyOff';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '../../../../components/Dialog';
import {showNotification} from '../../../../actions/notification';

const refundAllowedStatuses = ['COMPLETED'];
const canRefund = order => {
    if (refundAllowedStatuses.indexOf(order.status) === -1) {
        return false;
    }
    if (!order.refund) {
        return true;
    }
};

const OrderDialogRefund = props => {
    const {order, refundOrderIfNeeded} = props;
    const [isRefundOrderDialogOpen, setIsRefundOrderDialogOpen] = useState(false);
    const canRefundOrder = canRefund(order);
    const handleRefundOrderClick = () => setIsRefundOrderDialogOpen(true);
    const hideRefundOrderDialog = () => setIsRefundOrderDialogOpen(false);
    const handleRefundOrder = async () => {
        setIsRefundOrderDialogOpen(false);
        try {
            await refundOrderIfNeeded(order.extOrderId, order.totalAmount);
        } catch (e) {
            props.showNotification({
                message: e.message,
                variant: 'error',
            });
        }
    };
    if (!canRefundOrder) {
        return null;
    }
    return (
        <Fragment>
            <Tooltip title="Zwróć środki na konto kupującego">
                <IconButton aria-label="Zwróć środki na konto kupującego" onClick={handleRefundOrderClick}>
                    <RefundIcon color="error"/>
                </IconButton>
            </Tooltip>
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
    );
};

export default connect(null, {showNotification})(OrderDialogRefund);
