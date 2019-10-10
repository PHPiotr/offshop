import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import PayMethods from '../PayMethods';

const useStyles = makeStyles(theme => ({
    listItem: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
    bold: {
        fontWeight: '700',
    },
    title: {
        fontWeight: '700',
        marginTop: theme.spacing(2),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
    payMethods: {
        display: 'block',
        textAlign: 'right',
    },
}));

const Review = props => {
    const {
        products,
        buyerIds,
        buyerFormValues,
        buyerData,
        buyerDeliveryIds,
        buyerDeliveryFormValues,
        buyerDeliveryData,
        totalAmount,
        currency,
        cart,
    } = props;

    const classes = useStyles();

    return (
        <Fragment>
            <List disablePadding>
                {products.map(
                    ({id, name, unitPrice, totalPrice}) => (
                        <Fragment key={id}>
                            <ListItem className={classes.listItem}>
                                <ListItemText
                                    primary={name}
                                    secondary={`${cart.products[id].quantity} szt.`}
                                />
                                <Typography variant="body2">
                                    {`${(totalPrice / 100).toFixed(2)} ${currency}`}
                                </Typography>
                            </ListItem>
                            <Divider/>
                        </Fragment>
                    )
                )}
                <Fragment>
                    <ListItem className={classes.listItem}>
                        <ListItemText primary="Dostawa" secondary={props.deliveryMethod.name}/>
                        <Typography variant="body2">
                            {`${props.deliveryPrice} zł`}
                        </Typography>
                    </ListItem>
                    <Divider/>
                </Fragment>
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Do zapłaty"/>
                    <Typography variant="subtitle1" className={classes.bold}>
                        {`${(totalAmount / 100).toFixed(2)} ${currency}`}
                    </Typography>
                </ListItem>
                <Divider/>
            </List>
            <Fragment>
                <Typography variant="subtitle1" gutterBottom className={classes.title}>
                    Dane osoby kupującej
                </Typography>
                {buyerIds
                    .filter(id => buyerFormValues[id] !== undefined)
                    .map(id => (
                        <Fragment key={id}>
                            <ListItem className={classes.listItem}>
                                <ListItemText
                                    primary={buyerFormValues[id]}
                                    secondary={buyerData[id].label}
                                />
                            </ListItem>
                            <Divider/>
                        </Fragment>
                    ))}
            </Fragment>
            {props.deliveryMethod.unitPrice > 0 && (
                <Fragment>
                    <Typography variant="subtitle1" gutterBottom className={classes.title}>
                        Dane do wysyłki
                    </Typography>
                    <List disablePadding>
                        {buyerDeliveryIds
                            .filter(id => buyerDeliveryFormValues[id] !== undefined)
                            .map(id => (
                                <Fragment key={id}>
                                    <ListItem className={classes.listItem}>
                                        <ListItemText
                                            primary={buyerDeliveryFormValues[id]}
                                            secondary={buyerDeliveryData[id].label}
                                        />
                                    </ListItem>
                                    <Divider/>
                                </Fragment>
                            ))}
                    </List>
                </Fragment>
            )}
            <Typography variant="subtitle1" gutterBottom className={classes.title}>
                Wybierz metodę płatności
            </Typography>
            <PayMethods/>
        </Fragment>
    );
};

const mapStateToProps = state => ({
    products: state.cart.ids.map(i => {
        const product = state.products.data[i];
        const productInCart = state.cart.products[i];
        return {
            ...product,
            ...productInCart,
        };
    }),
    buyerIds: state.buyer.ids,
    buyerFormValues: state.form.buyer.values,
    buyerData: state.buyer.data,
    buyerDeliveryIds: state.buyerDelivery.ids,
    buyerDeliveryFormValues: state.form && state.form.buyerDelivery && state.form.buyerDelivery.values,
    buyerDeliveryData: state.buyerDelivery.data,
    cart: state.cart,
    totalAmount: state.cart.totalPriceWithDelivery,
    deliveryMethod: state.deliveryMethods.data[state.deliveryMethods.currentId],
    weight: state.cart.weight,
    deliveryPrice: (state.cart.deliveryTotalPrice / 100).toFixed(2),
});

Review.propTypes = {
    products: PropTypes.array.isRequired,
    totalAmount: PropTypes.number.isRequired,
    currency: PropTypes.string,
};

Review.defaultProps = {
    currency: 'zł',
};

export default connect(mapStateToProps)(Review);
