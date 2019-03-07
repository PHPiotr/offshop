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
import {FormattedMessage} from "react-intl";
import {connect} from 'react-redux';
import {setCurrentDeliveryMethod} from '../../../actions/deliveryMethods';
import {requireBuyerDeliveryStep, skipBuyerDeliveryStep} from '../../../actions/buyerDelivery';

const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    section1: {
        margin: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2}px`,
    },
    section2: {
        margin: theme.spacing.unit * 2,
    },
    section3: {
        margin: `${theme.spacing.unit * 6}px ${theme.spacing.unit * 2}px ${theme
            .spacing.unit * 2}px`,
    },
});

const CartSummary = props => {
    const { classes, cart, products, deliveryMethods } = props;

    const handleSetCurrentDeliveryMethod = e => {
        props.handleSetCurrentDeliveryMethod(deliveryMethods.find(s => s.id === e.target.value));
        props.toggleBuyerDeliveryStepRequired(!props.currentDeliveryMethod.unitPrice);
    };

    return (
        <div className={classes.root}>
            <div className={classes.section1}>
                <Typography gutterBottom variant="h6">
                    <FormattedMessage id='cart.summary.choose_delivery' />
                </Typography>
                <RadioGroup name="position" value={props.currentDeliveryMethod.id}>
                    {deliveryMethods.map(({ id, name, unitPrice }) => (
                        <FormControlLabel
                            key={id}
                            value={id}
                            control={<Radio color="primary" />}
                            label={`${name}: ${unitPrice * cart.quantity} zł`}
                            labelPlacement="end"
                            checked={id === props.currentDeliveryMethod.id}
                            onChange={handleSetCurrentDeliveryMethod}
                        />
                    ))}
                </RadioGroup>
            </div>
            <Divider variant="middle" />
            <div className={classes.section2}>
                <Grid container alignItems="center">
                    <Grid item xs>
                        <Typography gutterBottom variant="h6">
                            <FormattedMessage id='cart.summary.to_pay' />
                        </Typography>
                    </Grid>
                    <Grid item align="right">
                        <Typography gutterBottom variant="h6">
                            {`${(products.reduce(
                                (total, {unitPrice, _id}) => unitPrice * cart.products[_id].quantity + total,
                                0
                            ) +
                                (props.currentDeliveryMethod.unitPrice > 0
                                    ? cart.quantity *
                                      props.currentDeliveryMethod.unitPrice
                                    : 0)).toFixed(2)} zł`}
                        </Typography>
                    </Grid>
                </Grid>
            </div>
            <Divider variant="middle" />
            <div className={classes.section3}>
                <Button
                    onClick={props.checkout}
                    disabled={!props.currentDeliveryMethod.id}
                    variant="contained"
                    color="primary"
                >
                    <FormattedMessage id='cart.summary.order' />
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

const mapDispatchToProps = dispatch => ({
    handleSetCurrentDeliveryMethod(deliveryMethod) {
        dispatch(setCurrentDeliveryMethod(deliveryMethod));
    },
    toggleBuyerDeliveryStepRequired(required) {
        if (required) {
            dispatch(requireBuyerDeliveryStep());
        } else {
            dispatch(skipBuyerDeliveryStep());
        }
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CartSummary));
