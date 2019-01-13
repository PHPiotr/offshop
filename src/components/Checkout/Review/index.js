import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {getFormValues} from 'redux-form';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
    listItem: {
        padding: `${theme.spacing.unit}px 0`,
    },
    total: {
        fontWeight: '700',
    },
    title: {
        marginTop: theme.spacing.unit * 2,
    },
});

const Review = props => {
    const { classes, products, buyerDetails, buyerDeliveryDetails, totalPrice, currency } = props;

    return (
        <Fragment>
            <List disablePadding>
                {products.map(
                    ({ _id, name, inCart, pricePerItem, priceTotal }) => (
                        <Fragment key={_id}>
                            <ListItem className={classes.listItem}>
                                <ListItemText
                                    primary={name}
                                    secondary={`${inCart} szt.`}
                                />
                                <Typography variant="body2">
                                    {`${pricePerItem} x ${inCart} = ${priceTotal} ${currency}`}
                                </Typography>
                            </ListItem>
                            <Divider />
                        </Fragment>
                    )
                )}
                {props.supplier.pricePerUnit > 0 &&
                    <Fragment>
                        <ListItem className={classes.listItem}>
                            <ListItemText primary="Dostawa" secondary={props.supplier.title}/>
                            <Typography variant="body2">
                                {`${props.deliveryPrice} zł`}
                            </Typography>
                        </ListItem>
                        <Divider/>
                    </Fragment>
                }
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Do zapłaty" />
                    <Typography variant="subtitle1" className={classes.total}>
                        {`${totalPrice} ${currency}`}
                    </Typography>
                </ListItem>
                <Divider />
            </List>

            <Grid container spacing={16}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom className={classes.title}>
                        Dane kupującego
                    </Typography>
                    <Grid container>
                        {buyerDetails.map(({ label, value }) => (
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
                <Grid item container direction="column" xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom className={classes.title}>
                        Dane do wysyłki
                    </Typography>
                    <Grid container>
                        {buyerDeliveryDetails.map(({ label, value }) => (
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
            </Grid>
        </Fragment>
    );
};

let buyerValues;

const mapStateToProps = state => ({
    products: state.cart.ids.map(i => {
        const product = state.products.data[i];
        const pricePerItem = parseFloat(product.price).toFixed(2);
        return {
            ...product,
            pricePerItem,
            priceTotal: parseFloat(pricePerItem * product.inCart).toFixed(2),
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
        const item = state.buyerDelivery.data[i];
        if (item.type !== 'hidden' && item.value.trim()) {
            acc.push(item);
        }
        return acc;
    }, []),
    totalPrice: state.cart.totalPrice
        ? parseFloat(
              state.cart.totalPrice +
                  state.suppliers.data[state.suppliers.currentId].pricePerUnit * state.cart.units
          ).toFixed(2)
        : '0.00',
    supplier: state.suppliers.data[state.suppliers.currentId],
    totalUnits: state.cart.units,
    deliveryPrice: parseFloat(state.suppliers.data[state.suppliers.currentId].pricePerUnit * state.cart.units).toFixed(2),
});

Review.propTypes = {
    products: PropTypes.array.isRequired,
    buyerDetails: PropTypes.array.isRequired,
    buyerDeliveryDetails: PropTypes.array.isRequired,
    totalPrice: PropTypes.string.isRequired,
    currency: PropTypes.string,
};

Review.defaultProps = {
    currency: 'zł',
};

export default connect(mapStateToProps)(withStyles(styles)(Review));
