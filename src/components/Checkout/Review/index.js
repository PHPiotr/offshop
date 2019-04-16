import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {getFormValues, formValueSelector} from 'redux-form';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Grid from "@material-ui/core/Grid";
import withPayU from '../../../hoc/withPayU';
import PayuButton from "../PayuButton";
import {Helmet} from "react-helmet";

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
    const {classes, products, buyerDetails, buyerDeliveryDetails, totalPrice, currency, cart} = props;

    return (
        <Fragment>
            <Helmet>
                <script type="text/javascript">
                    {`
                                function test(data) {
                                    console.log("callback");
                                    console.log(data);
                                }
                            `}
                </script>
            </Helmet>
            <List disablePadding>
                {products.map(
                    ({_id, name, unitPrice, totalPrice}) => (
                        <Fragment key={_id}>
                            <ListItem className={classes.listItem}>
                                <ListItemText
                                    primary={name}
                                    secondary={`${cart.products[_id].quantity} szt.`}
                                />
                                <Typography variant="body2">
                                    {`${unitPrice} x ${cart.products[_id].quantity} = ${(totalPrice/100).toFixed(2)} ${currency}`}
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
                    <Typography variant="subtitle1" className={classes.total}>
                        {`${totalPrice} ${currency}`}
                    </Typography>
                </ListItem>
                <Divider/>
            </List>

            <Grid container spacing={16}>
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
            <PayuButton />
        </Fragment>
    );
};

let buyerValues;
let buyerDeliveryValues;

const selector = formValueSelector('buyer');

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
    totalPrice: state.cart.totalPrice
        ? ((state.cart.totalPrice + state.deliveryMethods.data[state.deliveryMethods.currentId].unitPrice * 100 * state.cart.quantity) / 100).toFixed(2)
        : '0.00',
    deliveryMethod: state.deliveryMethods.data[state.deliveryMethods.currentId],
    weight: state.cart.weight,
    deliveryPrice: (state.deliveryMethods.data[state.deliveryMethods.currentId].unitPrice * state.cart.quantity).toFixed(2),
    src: `${process.env.REACT_APP_PAYU_BASE_URL}/front/widget/js/payu-bootstrap.js`,
    successCallback: 'test',
    currencyCode: process.env.REACT_APP_CURRENCY_CODE,
    customerEmail: selector(state, 'email'),
    customerLanguage: 'pl',
    merchantPosId: process.env.REACT_APP_POS_ID,
    shopName: process.env.REACT_APP_MERCHANT_NAME,
    totalAmount: state.cart.totalPrice
        ? ((state.cart.totalPrice + state.deliveryMethods.data[state.deliveryMethods.currentId].unitPrice * 100 * state.cart.quantity) / 100).toFixed(2)
        : '0.00',
    secondKeyMd5: process.env.REACT_APP_SECOND_KEY,
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

export default connect(mapStateToProps)(withStyles(styles)(withPayU(Review)));
