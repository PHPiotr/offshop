import React, {Fragment} from 'react';
import {Helmet} from 'react-helmet';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import RequestHandler from '../../../components/RequestHandler';
import OrderListItemSecondaryAction from './OrderListItemSecondaryAction';
import RefundListItem from './RefundListItem';
import OrderListItem from './OrderListItem';
import ProductsListItem from './ProductsListItem';
import BuyerListItem from './BuyerListItem';
import DeliveryListItem from './DeliveryListItem';
import {getOrderIfNeeded} from '../../../actions/admin/order';

const useStyles = makeStyles(theme => ({
    list: {
        width: '100%',
    },
    listItem: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
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

const Order = props => {
    const classes = useStyles();
    const {order, getOrderIfNeeded} = props;
    const action = () => getOrderIfNeeded(props.match.params.id);

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
                            <OrderListItemSecondaryAction order={order}/>
                        </ListItem>
                        <Divider/>
                        {(order.refund && order.refund.refundId) && (
                            <Fragment>
                                <RefundListItem
                                    refund={order.refund}
                                />
                                <Divider/>
                            </Fragment>
                        )}
                        <OrderListItem
                            order={order}
                        />
                        {(order.products && order.products.length > 0) && (
                            <Fragment>
                                <Divider/>
                                <ProductsListItem
                                    currencyCode={order.currencyCode}
                                    products={order.products}
                                />
                            </Fragment>
                        )}
                        {order.buyer && (
                            <Fragment>
                                <Divider/>
                                <BuyerListItem
                                    buyer={order.buyer}
                                />
                            </Fragment>
                        )}
                        {order.buyer.delivery && (
                            <Fragment>
                                <Divider/>
                                <DeliveryListItem
                                    currencyCode={order.currencyCode}
                                    delivery={order.buyer.delivery}
                                    deliveryMethod={order.deliveryMethod}
                                />
                            </Fragment>
                        )}
                    </List>
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
    getOrderIfNeeded,
};

Order.propTypes = {
    getOrderIfNeeded: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Order);
