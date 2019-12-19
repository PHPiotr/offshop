import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {connect} from 'react-redux';
import {setCurrentDeliveryMethod} from '../../../actions/deliveryMethods';
import {withRouter} from 'react-router-dom';

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
    const { classes, cart, deliveryMethods } = props;

    const handleSetCurrentDeliveryMethod = e => {
        props.handleSetCurrentDeliveryMethod(deliveryMethods.find(s => s.id === e.target.value));
    };

    return (
        <div className={classes.root}>
            <div className={classes.section1}>
                <Typography gutterBottom variant="h6">
                    Wybierz sposób dostawy
                </Typography>
                <RadioGroup name="position" defaultValue={props.currentDeliveryMethod.id}>
                    {deliveryMethods.map(({ id, name, unitPrice }) => (
                        <FormControlLabel
                            data-testid={`radio-btn-${id}`}
                            key={id}
                            value={id}
                            control={<Radio color="primary" />}
                            label={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        <span>{name}</span>
                                    </Typography>
                                    <Typography component="span" color="textSecondary">
                                        &nbsp;<span>{`${(unitPrice * (cart.weight / 100) / 100).toFixed(2)}`}</span> zł
                                    </Typography>
                                </React.Fragment>
                            }
                            labelPlacement="end"
                            checked={id === props.currentDeliveryMethod.id}
                            onChange={handleSetCurrentDeliveryMethod}
                        />
                    ))}
                </RadioGroup>
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
                    onClick={props.checkout}
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
    deliveryMethods: PropTypes.array.isRequired,
    currentDeliveryMethod: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    cart: state.cart,
    products: state.cart.ids.map(i => state.products.data[i]),
    deliveryMethods: state.deliveryMethods.ids.map(i => state.deliveryMethods.data[i]),
    currentDeliveryMethod: state.deliveryMethods.data[state.deliveryMethods.currentId] || {},
});

const mapDispatchToProps = (dispatch, {history}) => ({
    checkout() {
        history.push('/checkout');
    },
    handleSetCurrentDeliveryMethod(deliveryMethod) {
        dispatch(setCurrentDeliveryMethod(deliveryMethod));
    },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CartSummary)));
