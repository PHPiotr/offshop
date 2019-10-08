import React, {Fragment, useEffect} from 'react';
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
}));

const OrdersList = props => {
    const classes = useStyles();
    const {
        getAdminOrdersIfNeeded,
        onAdminOrder,
        showNotification,
    } = props;
    useEffect(() => {
        getAdminOrdersIfNeeded();
    }, []);
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
    useEffect(() => {
        socket.on('adminCreateOrder', onAdminCreateOrderListener);
        socket.on('adminUpdateOrder', onAdminUpdateOrderListener);
        return () => {
            socket.off('adminCreateOrder', onAdminCreateOrderListener);
            socket.off('adminUpdateOrder', onAdminUpdateOrderListener);
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
                                    <span>{`${row.totalAmount && (row.totalAmount / 100).toFixed(2)}`}</span>
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
    showNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrdersList);
