import React, {Fragment, useState} from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RefundIcon from '@material-ui/icons/MoneyOff';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '../../../Dialog';

const refundAllowedStatuses = ['COMPLETED'];
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

const Refund = props => {
    const {order, refundOrderIfNeeded} = props;
    const [isRefundOrderDialogOpen, setIsRefundOrderDialogOpen] = useState(false);
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

export default Refund;
