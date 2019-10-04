import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {getFormValues} from 'redux-form';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import PayMethods from '../PayMethods';

const styles = theme => ({
    listItem: {
        padding: `${theme.spacing(1)}px 0`,
    },
    bold: {
        fontWeight: '700',
    },
    title: {
        fontWeight: '700',
        marginTop: theme.spacing(2),
    },
    payMethods: {
        display: 'block',
        textAlign: 'right',
    },
});

let Review = props => {
    const {classes, products, buyerDetails, buyerDeliveryDetails, totalAmount, currency, cart} = props;

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
                                    {`${(totalPrice/100).toFixed(2)} ${currency}`}
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
            {buyerDetails.length > 0 && (
                <Fragment>
                    <Typography variant="subtitle1" gutterBottom className={classes.title}>
                        Dane osoby kupującej
                    </Typography>
                    {buyerDetails.map(({label, value}) => (
                        <Fragment key={label}>
                            <ListItem className={classes.listItem}>
                                <ListItemText
                                    primary={value}
                                    secondary={label}
                                />
                            </ListItem>
                            <Divider/>
                        </Fragment>
                    ))}
                </Fragment>
            )}
            {(props.deliveryMethod.unitPrice > 0 && buyerDeliveryDetails.length > 0) && (
                <Fragment>
                    <Typography variant="subtitle1" gutterBottom className={classes.title}>
                        Dane do wysyłki
                    </Typography>
                    <List disablePadding>
                        {buyerDeliveryDetails.map(({label, value}) => (
                            <Fragment key={label}>
                                <ListItem className={classes.listItem}>
                                    <ListItemText
                                        primary={value}
                                        secondary={label}
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
            <PayMethods />
        </Fragment>
    );
};

let buyerValues;
let buyerDeliveryValues;

const mapStateToProps = state => ({
    products: state.cart.ids.map(i => {
        const product = state.products.data[i];
        const productInCart = state.cart.products[i];
        return {
            ...product,
            ...productInCart,
        };
    }),
    buyerDetails: state.buyer.ids.reduce((acc, i) => {
        if (!buyerValues) {
            buyerValues = getFormValues('buyer')(state) || {};
        }
        const value = buyerValues[i];
        if (value) {
            acc.push({label: state.buyer.data[i].label, value});
        }
        return acc;
    }, []),
    buyerDeliveryDetails: state.buyerDelivery.ids.reduce((acc, i) => {
        if (!buyerDeliveryValues) {
            buyerDeliveryValues = getFormValues('buyerDelivery')(state) || {};
        }
        const value = buyerDeliveryValues[i];
        if (value) {
            acc.push({label: state.buyerDelivery.data[i].label, value});
        }
        return acc;
    }, []),
    cart: state.cart,
    totalAmount: state.cart.totalPriceWithDelivery,
    deliveryMethod: state.deliveryMethods.data[state.deliveryMethods.currentId],
    weight: state.cart.weight,
    deliveryPrice: (state.cart.deliveryTotalPrice / 100).toFixed(2),
});

Review.propTypes = {
    products: PropTypes.array.isRequired,
    buyerDetails: PropTypes.array.isRequired,
    buyerDeliveryDetails: PropTypes.array.isRequired,
    totalAmount: PropTypes.number.isRequired,
    currency: PropTypes.string,
};

Review.defaultProps = {
    currency: 'zł',
};

export default connect(mapStateToProps)(withStyles(styles)(Review));
