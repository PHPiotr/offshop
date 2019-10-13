import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import ProgressIndicator from '../../components/ProgressIndicator';
import {onAdminRefund} from '../../actions/admin/order';
import {getAdminOrdersIfNeeded, onAdminOrder} from '../../actions/admin/orders';
import {showNotification} from '../../actions/notification';
import io from '../../io';
const socket = io();

const useStyles = makeStyles(theme => ({
    list: {
        width: '100%',
    },
    textRight: {
        textAlign: 'right',
    },
    refund: {
        textDecoration: 'line-through',
    },
}));

const OrdersList = props => {
    const classes = useStyles();
    const {
        getAdminOrdersIfNeeded,
        onAdminOrder,
        onAdminRefund,
        showNotification,
    } = props;
    const [sort, setSort] = useState('createdAt');
    const [order, setOrder] = useState(-1);
    const [limit, setLimit] = useState(20);
    const [skip, setSkip] = useState(0);
    const [hasMoreData, setHasMoreData] = useState(true);
    useEffect(() => {
        if (!hasMoreData) {
            return;
        }
        getAdminOrdersIfNeeded({sort, order, limit, skip}).then(payload => {
            if (payload && payload.result && payload.result.length < limit) {
                setHasMoreData(false);
            }
        });
    }, [sort, order, limit, skip]);
    useEffect(() => {
        window.onscroll = () => {
            if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
                setSkip(skip + limit);
            }
        };
        return () => {
            window.onscroll = null;
        }
    });
    const onAdminCreateOrderListener = order => {
        onAdminOrder(order);
        showNotification({
            message: `Nowa transakcja: ${order.extOrderId} została dodana.`,
            variant: 'success',
        });
    };
    const onAdminUpdateOrderListener = order => {
        onAdminOrder(order);
        showNotification({
            message: `Status transakcji: ${order.extOrderId} został zmieniony.`,
            variant: 'warning',
        });
    };
    const onAdminRefundListener = ({refund, extOrderId}) => {
        onAdminRefund(refund);
        showNotification({
            message: `Status zwrotu zamówienia ${extOrderId} został zmieniony na ${refund.status}.`,
            variant: 'warning',
        });
    };
    useEffect(() => {
        socket.on('adminCreateOrder', onAdminCreateOrderListener);
        socket.on('adminUpdateOrder', onAdminUpdateOrderListener);
        socket.on('adminRefund', onAdminRefundListener);
        return () => {
            socket.off('adminCreateOrder', onAdminCreateOrderListener);
            socket.off('adminUpdateOrder', onAdminUpdateOrderListener);
            socket.off('adminRefund', onAdminRefundListener);
        };
    }, []);

    return (
        <Fragment>
            {props.isFetching && <ProgressIndicator />}
            <List disablePadding className={classes.list}>
                {props.data.map(row => (
                    <Fragment>
                        <ListItem button component={Link} to={`/admin/orders/${row.extOrderId}`} className={classes.listItem} key={row.extOrderId}>
                            <ListItemText
                                primary={row.extOrderId}
                                secondary={row.status}
                            />
                            <ListItemSecondaryAction>
                                <Typography
                                    className={classes.textRight}
                                    component="p"
                                    variant="body2"
                                    color="textPrimary"
                                >
                                    <span className={(row.refund && row.refund.status) ? classes.refund : null}>{`${row.totalAmount && (row.totalAmount / 100).toFixed(2)}`}</span>
                                    <span className={classes.currency}>&nbsp;zł</span>
                                </Typography>
                                <Typography
                                    component="p"
                                    variant="body2"
                                    color="textSecondary"
                                >{new Date(row.orderCreateDate).toLocaleString('pl', {dateStyle: 'short', timeStyle: 'short'})}</Typography>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                    </Fragment>
                ))}
            </List>
        </Fragment>
    );
};

OrdersList.propTypes = {
    data: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    data: state.adminOrders.ids.map(i => state.adminOrders.data[i]),
    isFetching: state.adminOrders.isFetching,
});

const mapDispatchToProps = {
    getAdminOrdersIfNeeded,
    onAdminOrder,
    onAdminRefund,
    showNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrdersList);
