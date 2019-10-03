import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import ProgressIndicator from '../../components/ProgressIndicator';
import {getAdminOrdersIfNeeded, onAdminOrder} from '../../actions/admin/orders';
import {showNotification} from '../../actions/notification';
import io from '../../io';
const socket = io();

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    paper: {
        marginTop: theme.spacing(3),
        width: '100%',
        overflowX: 'auto',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 650,
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
            <Table className={classes.table} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Opis</TableCell>
                        <TableCell align="right">Data</TableCell>
                        <TableCell align="right">Kwota&nbsp;(zł)</TableCell>
                        <TableCell align="right">Waga&nbsp;(kg)</TableCell>
                        <TableCell align="right">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.data.map(row => (
                        <TableRow key={row.extOrderId}>
                            <TableCell component="th" scope="row">
                                <Link to={`/admin/orders/${row.extOrderId}`}>{row.description}</Link>
                            </TableCell>
                            <TableCell align="right">{new Date(row.orderCreateDate).toLocaleString('pl')}</TableCell>
                            <TableCell align="right">{row.totalAmount && (row.totalAmount / 100).toFixed(2)}</TableCell>
                            <TableCell align="right">{row.totalWeight / 100}</TableCell>
                            <TableCell align="right">{row.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
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
