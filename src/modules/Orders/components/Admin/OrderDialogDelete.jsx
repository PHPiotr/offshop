import React, {Fragment, useState} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '../../../../components/Dialog';
import {showNotification} from '../../../../actions/notification';

const deleteAllowedStatuses = ['LOCAL_NEW_INITIATED', 'LOCAL_NEW_REJECTED', 'LOCAL_NEW_COMPLETED'];
const canDeleteForStatus = status => deleteAllowedStatuses.indexOf(status) > -1;

const OrderDialogDelete = props => {
    const {order, deleteOrderIfNeeded} = props;
    const [isDeleteOrderDialogOpen, setIsDeleteOrderDialogOpen] = useState(false);
    const handleDeleteOrderClick = () => setIsDeleteOrderDialogOpen(true);
    const hideDeleteOrderDialog = () => setIsDeleteOrderDialogOpen(false);
    const handleDeleteOrder = async () => {
        setIsDeleteOrderDialogOpen(false);
        try {
            await deleteOrderIfNeeded(order.extOrderId);
            props.showNotification({
                message: `Zamówienie ${order.extOrderId} zostało usunięte`,
                variant: 'success',
            });
            props.history.replace('/admin/orders/list');
        } catch (e){
            props.showNotification({
                message: e.message,
                variant: 'error',
            });
        }
    };
    if (!canDeleteForStatus(order.status)) {
        return null;
    }
    return (
        <Fragment>
            <Tooltip title="Usuń zamówienie">
                <IconButton aria-label="Usuń zamówienie" onClick={handleDeleteOrderClick}>
                    <DeleteIcon color="error"/>
                </IconButton>
            </Tooltip>
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

export default withRouter(connect(null, {showNotification})(OrderDialogDelete));
