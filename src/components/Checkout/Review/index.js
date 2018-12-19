import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

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
    const { classes, products, shippingDetails, totalPrice, currency } = props;

    return (
        <Fragment>
            <List disablePadding>
                {products.map(
                    ({ id, title, inCart, pricePerItem, priceTotal }) => (
                        <Fragment key={id}>
                            <ListItem className={classes.listItem}>
                                <ListItemText
                                    primary={title}
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
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Do zapłaty" />
                    <Typography variant="subtitle1" className={classes.total}>
                        {`${totalPrice} ${currency}`}
                    </Typography>
                </ListItem>
                <Divider />
            </List>
            <Typography variant="h6" gutterBottom className={classes.title}>
                Dane do wysyłki
            </Typography>
            <List disablePadding>
                {shippingDetails.map(({ label, value }) => {
                    return (
                        <Fragment key={label}>
                            <ListItem className={classes.listItem}>
                                <ListItemText primary={label} />
                                <Typography
                                    variant="subtitle1"
                                    className={classes.total}
                                >
                                    {value}
                                </Typography>
                            </ListItem>
                            <Divider />
                        </Fragment>
                    );
                })}
            </List>
        </Fragment>
    );
};

const mapStateToProps = state => ({
    products: state.products.items.reduce((accumulator, product) => {
        if (product.inCart > 0) {
            const pricePerItem = parseFloat(product.price).toFixed(2);
            accumulator.push({
                ...product,
                pricePerItem,
                priceTotal: parseFloat(pricePerItem * product.inCart).toFixed(
                    2
                ),
            });
        }
        return accumulator;
    }, []),
    shippingDetails: state.shipping.itemIds.map(
        itemId => state.shipping.items[itemId]
    ),
    totalPrice: state.cart.totalPrice
        ? parseFloat(
              state.cart.totalPrice +
                  state.suppliers.current.pricePerUnit * state.cart.units
          ).toFixed(2)
        : '0.00',
});

Review.propTypes = {
    products: PropTypes.array.isRequired,
    shippingDetails: PropTypes.array.isRequired,
    totalPrice: PropTypes.string.isRequired,
    currency: PropTypes.string,
};

Review.defaultProps = {
    currency: 'zł',
};

export default connect(mapStateToProps)(withStyles(styles)(Review));
