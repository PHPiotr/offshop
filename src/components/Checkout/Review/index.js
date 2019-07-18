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
import Grid from "@material-ui/core/Grid";
import PayMethods from '../PayMethods';

const styles = theme => ({
    listItem: {
        padding: `${theme.spacing(1)}px 0`,
    },
    total: {
        fontWeight: '700',
    },
    title: {
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
                                    {cart.products[id].quantity > 1 && `${(unitPrice / 100).toFixed(2)} zł x ${cart.products[id].quantity} szt. = `}
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
                            {cart.weight/100 !== 1 && `${cart.weight/100} kg x ${(cart.deliveryUnitPrice / 100).toFixed(2)} zł = ${props.deliveryPrice} zł`}
                        </Typography>
                    </ListItem>
                    <Divider/>
                </Fragment>
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Do zapłaty"/>
                    <Typography variant="subtitle1" className={classes.total}>
                        {`${(totalAmount / 100).toFixed(2)} ${currency}`}
                    </Typography>
                </ListItem>
                <Divider/>
            </List>

            <Grid container spacing={10}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom className={classes.title}>
                        Dane kupującego
                    </Typography>
                    <Grid container>
                        {buyerDetails.map(({label, value}) => (
                            <Fragment key={label}>
                                <Grid item xs={6}>
                                    <Typography gutterBottom>{label}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography gutterBottom>{value}</Typography>
                                </Grid>
                            </Fragment>
                        ))}
                    </Grid>
                </Grid>
                {props.deliveryMethod.unitPrice > 0 && (
                    <Grid item container direction="column" xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom className={classes.title}>
                            Dane do wysyłki
                        </Typography>
                        <Grid container>
                            {buyerDeliveryDetails.map(({label, value}) => (
                                <Fragment key={label}>
                                    <Grid item xs={6}>
                                        <Typography gutterBottom>{label}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography gutterBottom>{value}</Typography>
                                    </Grid>
                                </Fragment>
                            ))}
                        </Grid>
                    </Grid>
                )}
            </Grid>
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
