import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import DeliveryMethods from '../../Delivery/components/DeliveryMethods';

const styles = theme => ({
    root: {
        width: '100%',
    },
    section1: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        margin: '2rem 0',
    },
    section2: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        margin: '1rem 0',
    },
    section3: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        margin: '2rem 0 1rem',
    },
    divider: {
        margin: 0,
    },
});

const CartSummary = props => {
    const { classes, cart } = props;

    const handleGoToCheckoutPage = () => props.history.push('/checkout');

    return (
        <div className={classes.root}>
            <div className={classes.section1}>
                <Typography gutterBottom variant="h6">
                    Wybierz sposób dostawy
                </Typography>
                <DeliveryMethods/>
            </div>
            <Divider variant="middle" className={classes.divider} />
            <div className={classes.section2}>
                <Grid container alignItems="center">
                    <Grid item xs>
                        <Typography gutterBottom variant="h6">
                            Do zapłaty
                        </Typography>
                    </Grid>
                    <Grid item align="right">
                        <Typography gutterBottom variant="h6">
                            <span data-testid="total-price-with-delivery">{`${(cart.totalPriceWithDelivery / 100).toFixed(2)}`}</span>&nbsp;zł
                        </Typography>
                    </Grid>
                </Grid>
            </div>
            <Divider variant="middle" className={classes.divider} />
            <div className={classes.section3}>
                <Button
                    data-testid="checkout-btn"
                    onClick={handleGoToCheckoutPage}
                    disabled={!props.currentDeliveryMethod.id}
                    variant="contained"
                    color="primary"
                >
                    Dalej
                </Button>
            </div>
        </div>
    );
};

CartSummary.propTypes = {
    classes: PropTypes.object.isRequired,
    cart: PropTypes.object.isRequired,
    products: PropTypes.array.isRequired,
    currentDeliveryMethod: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    cart: state.cart,
    products: state.cart.ids.map(i => state.products.data[i]),
    currentDeliveryMethod: state.deliveryMethods.data[state.deliveryMethods.currentId] || {},
});

export default withRouter(connect(mapStateToProps)(withStyles(styles)(CartSummary)));
