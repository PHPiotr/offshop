import React, {Fragment, useState, useEffect, useContext} from 'react';
import {connect} from 'react-redux';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import OrderRefundDetailsList from './OrderRefundDetailsList';
import ButtonListItem from '../../../../components/List/ButtonListItem';
import {showNotification} from '../../../../actions/notification';
import {onAdminRefund} from '../../actions';
import SocketContext from '../../../../contexts/SocketContext';

const OrderRefundListItem = props => {
    const socket = useContext(SocketContext);
    const {
        refund,
        onAdminRefund,
        showNotification,
    } = props;
    const [refundOpen, setRefundOpen] = useState(false);

    const onAdminRefundListener = ({order}) => {
        onAdminRefund(order);
        showNotification({
            message: `Status zwrotu został zmieniony na ${order.refund.status}.`,
            variant: 'warning',
        });
    };

    useEffect(() => {
        socket.on('adminRefund', onAdminRefundListener);
        return () => {
            socket.off('adminRefund', onAdminRefundListener);
        }
    }, []);

    const handleRefundClick = () => {
        setRefundOpen(!refundOpen);
    };
    return (
        <Fragment>
            <ButtonListItem onClick={handleRefundClick}>
                <ListItemText
                    primary="Zwrot"
                />
                {refundOpen ? <ExpandLess/> : <ExpandMore/>}
            </ButtonListItem>
            <Collapse in={refundOpen} timeout="auto" unmountOnExit>
                <OrderRefundDetailsList refund={refund} />
            </Collapse>
        </Fragment>
    );
};

const mapDispatchToProps = {
    showNotification,
    onAdminRefund,
};

export default connect(null, mapDispatchToProps)(OrderRefundListItem);
