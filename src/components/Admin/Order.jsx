import React, {Fragment, useState} from 'react';
import {Helmet} from 'react-helmet';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import RefundIcon from '@material-ui/icons/MoneyOff';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import RequestHandler from '../../containers/RequestHandler';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import Dialog from '../Dialog';
import {
    getOrderIfNeeded,
    cancelOrderIfNeeded,
    deleteOrderIfNeeded,
    refundOrderIfNeeded
} from '../../actions/admin/order';

const useStyles = makeStyles(theme => ({
    list: {
        width: '100%',
    },
    listItem: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
    nested: {
        paddingLeft: theme.spacing(3),
    },
    secondaryAction: {
        right: 0,
    },
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

const cancelAllowedStatuses = ['NEW', 'PENDING', 'WAITING_FOR_CONFIRMATION', 'REJECTED'];
const deleteAllowedStatuses = ['LOCAL_NEW_INITIATED', 'LOCAL_NEW_REJECTED', 'LOCAL_NEW_COMPLETED'];
const refundAllowedStatuses = ['COMPLETED'];
const canCancelForStatus = status => cancelAllowedStatuses.indexOf(status) > -1;
const canDeleteForStatus = status => deleteAllowedStatuses.indexOf(status) > -1;
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

const Order = props => {
    const classes = useStyles();
    const {order, getOrderIfNeeded, cancelOrderIfNeeded, deleteOrderIfNeeded, refundOrderIfNeeded} = props;
    const action = () => getOrderIfNeeded(props.match.params.id);

    const [isCancelOrderDialogOpen, setIsCancelOrderDialogOpen] = useState(false);
    const [isDeleteOrderDialogOpen, setIsDeleteOrderDialogOpen] = useState(false);
    const [isRefundOrderDialogOpen, setIsRefundOrderDialogOpen] = useState(false);

    const handleCancelOrderClick = () => setIsCancelOrderDialogOpen(true);
    const hideCancelOrderDialog = () => setIsCancelOrderDialogOpen(false);
    const handleCancelOrder = () => {
        setIsCancelOrderDialogOpen(false);
        cancelOrderIfNeeded(order.extOrderId, order.status);
    };

    const handleDeleteOrderClick = () => setIsDeleteOrderDialogOpen(true);
    const hideDeleteOrderDialog = () => setIsDeleteOrderDialogOpen(false);
    const handleDeleteOrder = async () => {
        setIsDeleteOrderDialogOpen(false);
        try {
            await deleteOrderIfNeeded(order.extOrderId);
            props.history.replace('/admin/orders/list');
        } catch {
        }
    };

    const [refundOpen, setRefundOpen] = useState(true);
    const handleRefundClick = () => {
        setRefundOpen(!refundOpen);
    };

    const [detailsOpen, setDetailsOpen] = useState(true);
    const handleDetailsClick = () => {
        setDetailsOpen(!detailsOpen);
    };

    const [productsOpen, setProductsOpen] = useState(false);
    const handleProductsClick = () => {
        setProductsOpen(!productsOpen);
    };

    const [buyerOpen, setBuyerOpen] = useState(false);
    const handleBuyerClick = () => {
        setBuyerOpen(!buyerOpen);
    };

    const [deliveryOpen, setDeliveryOpen] = useState(false);
    const handleDeliveryClick = () => {
        setDeliveryOpen(!deliveryOpen);
    };

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

    return (
        <RequestHandler action={action}>
            {() => (
                <Fragment>
                    <Helmet>
                        <title>{`Zamówienie ${order.extOrderId}`}</title>
                    </Helmet>
                    <List
                        className={classes.list}
                        disablePadding
                    >
                        <ListItem className={classes.listItem}>
                            <ListItemText
                                primary={`Zamówienie ${order.extOrderId}`}
                            />
                            <ListItemSecondaryAction className={classes.secondaryAction}>
                                {canCancelForStatus(order.status) && (<Tooltip title="Anuluj zamówienie">
                                    <IconButton aria-label="Anuluj zamówienie" onClick={handleCancelOrderClick}>
                                        <CancelIcon color="error"/>
                                    </IconButton>
                                </Tooltip>)}
                                {canDeleteForStatus(order.status) && (<Tooltip title="Usuń zamówienie">
                                    <IconButton aria-label="Usuń zamówienie" onClick={handleDeleteOrderClick}>
                                        <DeleteIcon color="error"/>
                                    </IconButton>
                                </Tooltip>)}
                                {canRefundOrder && (<Tooltip
                                    title="Wykonaj zwrot zamówienia">
                                    <IconButton
                                        aria-label="Wykonaj zwrot zamówienia"
                                        onClick={handleRefundOrderClick}>
                                        <RefundIcon color="error"/>
                                    </IconButton>
                                </Tooltip>)}
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider/>
                        {order.refund.refundId && (
                            <Fragment>
                                <ListItem button onClick={handleRefundClick} className={classes.listItem}>
                                    <ListItemText
                                        primary="Zwrot"
                                    />
                                    {refundOpen ? <ExpandLess/> : <ExpandMore/>}
                                </ListItem>
                                <Collapse in={refundOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <ListItem className={classes.nested}>
                                            <ListItemText
                                                primary={order.refund.status}
                                                secondary="Status zwrotu"
                                            />
                                        </ListItem>
                                        <ListItem className={classes.nested}>
                                            <ListItemText
                                                primary={`${(order.refund.amount / 100).toFixed(2)} ${order.refund.currencyCode}`}
                                                secondary="Kwota zwrotu"
                                            />
                                        </ListItem>
                                        <ListItem className={classes.nested}>
                                            <ListItemText
                                                primary={(new Date(order.refund.refundDate || order.refund.statusDateTime)).toLocaleString('pl', {
                                                    dateStyle: 'short',
                                                    timeStyle: 'short'
                                                })}
                                                secondary="Data zwrotu"
                                            />
                                        </ListItem>
                                        <ListItem className={classes.nested}>
                                            <ListItemText
                                                primary={order.refund.reason}
                                                secondary="Powód zwrotu"
                                            />
                                        </ListItem>
                                        <ListItem className={classes.nested}>
                                            <ListItemText
                                                primary={order.refund.reasonDescription}
                                                secondary="Opis zwrotu"
                                            />
                                        </ListItem>
                                        <ListItem className={classes.nested}>
                                            <ListItemText
                                                primary={order.refund.refundId}
                                                secondary="Numer zwrotu (refundId)"
                                            />
                                        </ListItem>
                                        <ListItem className={classes.nested}>
                                            <ListItemText
                                                primary={order.refund.extRefundId}
                                                secondary="Zewnętrzny numer zwrotu (extRefundId)"
                                            />
                                        </ListItem>
                                    </List>
                                </Collapse>
                                <Divider/>
                            </Fragment>
                        )}
                        <ListItem button onClick={handleDetailsClick} className={classes.listItem}>
                            <ListItemText
                                primary="Szczegóły"
                            />
                            {detailsOpen ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>
                        <Collapse in={detailsOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem className={classes.nested}>
                                    <ListItemText
                                        primary={order.status}
                                        secondary="Status"
                                    />
                                </ListItem>
                                <ListItem className={classes.nested}>
                                    <ListItemText
                                        primary={(new Date(order.localReceiptDateTime || order.orderCreateDate)).toLocaleString('pl', {
                                            dateStyle: 'short',
                                            timeStyle: 'short'
                                        })}
                                        secondary="Data"
                                    />
                                </ListItem>
                                <ListItem className={classes.nested}>
                                    <ListItemText
                                        primary={`${(order.totalAmount / 100).toFixed(2)} zł`}
                                        secondary="Kwota z dostawą"
                                    />
                                </ListItem>
                                <ListItem className={classes.nested}>
                                    <ListItemText
                                        primary={`${(order.totalWithoutDelivery / 100).toFixed(2)} zł`}
                                        secondary="Kwota bez dostawy"
                                    />
                                </ListItem>
                                <ListItem className={classes.nested}>
                                    <ListItemText
                                        primary={`${(order.totalWeight / 100).toFixed(2)} kg`}
                                        secondary="Waga"
                                    />
                                </ListItem>
                                <ListItem className={classes.nested}>
                                    <ListItemText
                                        primary={order.extOrderId}
                                        secondary="Nr zamówienia widoczny dla klienta"
                                    />
                                </ListItem>
                                <ListItem className={classes.nested}>
                                    <ListItemText
                                        primary={order.orderId}
                                        secondary="Nr zamówienia w PayU (niewidoczny dla klienta)"
                                    />
                                </ListItem>
                                {order.properties.map(({name, value}) => (
                                    <ListItem className={classes.nested}>
                                        <ListItemText
                                            primary={value}
                                            secondary={name}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                        <Divider/>
                        <ListItem button onClick={handleProductsClick} className={classes.listItem}>
                            <ListItemText
                                primary="Produkty"
                            />
                            {productsOpen ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>
                        <Collapse in={productsOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {(order.products || []).map(({name, quantity, unitPrice}) => (
                                    <ListItem key={name} className={classes.nested}>
                                        <ListItemText
                                            primary={`${name} (${quantity} szt.)`}
                                            secondary={`${(unitPrice / 100).toFixed(2)} zł / szt`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                        <Divider/>
                        <ListItem button onClick={handleBuyerClick} className={classes.listItem}>
                            <ListItemText
                                primary="Kupujący"
                            />
                            {buyerOpen ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>
                        <Collapse in={buyerOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem className={classes.nested}>
                                    <ListItemText
                                        primary={order.buyer.firstName}
                                        secondary="Imię"
                                    />
                                </ListItem>
                                <ListItem className={classes.nested}>
                                    <ListItemText
                                        primary={order.buyer.lastName}
                                        secondary="Nazwisko"
                                    />
                                </ListItem>
                                <ListItem className={classes.nested}>
                                    <ListItemText
                                        primary={order.buyer.email}
                                        secondary="Adres e-mail"
                                    />
                                </ListItem>
                                <ListItem className={classes.nested}>
                                    <ListItemText
                                        primary={order.buyer.phone}
                                        secondary="Telefon"
                                    />
                                </ListItem>
                            </List>
                        </Collapse>
                        {order.buyer.delivery && (
                            <Fragment>
                                <Divider/>
                                <ListItem button onClick={handleDeliveryClick} className={classes.listItem}>
                                    <ListItemText
                                        primary="Dostawa"
                                    />
                                    {deliveryOpen ? <ExpandLess/> : <ExpandMore/>}
                                </ListItem>
                                <Collapse in={deliveryOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <ListItem className={classes.nested}>
                                            <ListItemText
                                                primary={`${order.deliveryMethod.name} (${(order.deliveryMethod.unitPrice / 100).toFixed(2)} zł / kg)`}
                                                secondary="Wybrana opcja"
                                            />
                                        </ListItem>
                                        <ListItem className={classes.nested}>
                                            <ListItemText
                                                primary={order.buyer.delivery.recipientName}
                                                secondary="Odbiorca"
                                            />
                                        </ListItem>
                                        <ListItem className={classes.nested}>
                                            <ListItemText
                                                primary={order.buyer.delivery.postalCode}
                                                secondary="Kod pocztowy"
                                            />
                                        </ListItem>
                                        <ListItem className={classes.nested}>
                                            <ListItemText
                                                primary={order.buyer.delivery.city}
                                                secondary="Miasto"
                                            />
                                        </ListItem>
                                        <ListItem className={classes.nested}>
                                            <ListItemText
                                                primary={order.buyer.delivery.street}
                                                secondary="Ulica"
                                            />
                                        </ListItem>
                                    </List>
                                </Collapse>
                            </Fragment>
                        )}

                    </List>
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
            )}
        </RequestHandler>
    );
};

const mapStateToProps = state => ({
    order: state.adminOrder.data[state.adminOrder.id] || {
        buyer: {
            delivery: {},
        },
        deliveryMethod: {},
        properties: [],
        refund: {},
    },
    isFetching: state.adminOrder.isFetching,
});
const mapDispatchToProps = {
    cancelOrderIfNeeded,
    deleteOrderIfNeeded,
    getOrderIfNeeded,
    refundOrderIfNeeded,
};

Order.propTypes = {
    cancelOrderIfNeeded: PropTypes.func.isRequired,
    deleteOrderIfNeeded: PropTypes.func.isRequired,
    getOrderIfNeeded: PropTypes.func.isRequired,
    refundOrderIfNeeded: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Order));
