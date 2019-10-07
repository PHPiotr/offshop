import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {Box} from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
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
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        width: '100%',
    },
    listItem: {
        padding: 0,
    },
    listItemHeader: {
        color: theme.palette.text.secondary,
        [theme.breakpoints.down(850)]: {
            display: 'none',
            visibility: 'hidden',
        },
    },
    box: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        [theme.breakpoints.down(850)]: {
            display: 'block',
        },
    },
    columnRight: {
        textAlign: 'right',
    },
    column30: {
        width: '30%',
    },
    column15: {
        width: '15%',
    },
    column25: {
        width: '25%',
    },
    column: {
        [theme.breakpoints.down(850)]: {
            paddingRight: 0,
            width: '100%',
            textAlign: 'left',
        },
    },
    currency: {
        display: 'none',
        visibility: 'hidden',
        [theme.breakpoints.down(850)]: {
            display: 'inline',
            visibility: 'inherit',
        },
    },
}));

const OrdersList = props => {
    const classes = useStyles();
    const {
        getAdminOrdersIfNeeded,
        onAdminOrder,
        showNotification,
        className,
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
                <ListItem className={clsx(classes.listItem, classes.listItemHeader, className)}>
                    <ListItemText
                        primary={<Box className={classes.box}>
                            <Box className={clsx(classes.column, classes.column30, className)}>Numer transakcji</Box>
                            <Box className={clsx(classes.column, classes.column30, className)}>Status</Box>
                            <Box className={clsx(classes.columnRight, classes.column15, classes.column, className)}>Kwota (zł)</Box>
                            <Box className={clsx(classes.columnRight, classes.column25, classes.column, className)}>Data</Box>
                        </Box>}
                    />
                </ListItem>
                {props.data.map(row => (
                    <Fragment>
                        <ListItem className={classes.listItem} key={row.extOrderId}>
                            <ListItemText
                                primary={<Box className={classes.box}>
                                    <Box className={clsx(classes.column, classes.column30, className)}>
                                        <Link to={`/admin/orders/${row.extOrderId}`}>{row.extOrderId}</Link>
                                    </Box>
                                    <Typography
                                        component="p"
                                        variant="body2"
                                        color="textPrimary"
                                        className={clsx(classes.column, classes.column30, className)}
                                    >{row.status}</Typography>
                                    <Typography
                                        component="p"
                                        variant="body2"
                                        color="textPrimary"
                                        className={clsx(classes.columnRight, classes.column15, classes.column, className)}
                                    >
                                        <span>{`${row.totalAmount && (row.totalAmount / 100).toFixed(2)}`}</span>
                                        <spam className={classes.currency}>&nbsp;zł</spam>
                                    </Typography>
                                    <Typography
                                        component="p"
                                        variant="body2"
                                        color="textSecondary"
                                        className={clsx(classes.columnRight, classes.column25, classes.column, className)}
                                    >{new Date(row.orderCreateDate).toLocaleString('pl', {dateStyle: 'short', timeStyle: 'short'})}</Typography>
                                </Box>}
                            />
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
