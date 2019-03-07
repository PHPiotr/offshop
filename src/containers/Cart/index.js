import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import CartProducts from '../../components/Cart/Products';
import CartSummary from '../../components/Cart/Summary';
import SubHeader from '../../components/SubHeader';
import { addToCart, decrementInCart, deleteFromCart } from '../../actions/cart';
import { setCurrentDeliveryMethod } from '../../actions/deliveryMethods';
import {requireBuyerDeliveryStep, skipBuyerDeliveryStep} from '../../actions/buyerDelivery';
import Paper from '@material-ui/core/Paper/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import {injectIntl, FormattedMessage} from 'react-intl';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {getDeliveryMethodsIfNeeded} from "../../actions/deliveryMethods";

const styles = theme => ({
    paper: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            marginTop: 0,
            marginBottom: 0,
            padding: theme.spacing.unit * 3,
        },
        width: '100%',
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit,
    },
});

class Cart extends Component {

    componentDidMount() {
        this.props.handleGetDeliveryMethodsIfNeeded();
    }

    render() {
        if (!this.props.products.length) {
            return (
                <Fragment>
                    <SubHeader content={this.props.intl.formatMessage({id: 'cart.heading'})}/>
                    <Paper className={this.props.classes.paper}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Typography variant="subheading">
                                <FormattedMessage id="cart.empty"/>
                            </Typography>
                        </Grid>
                    </Paper>
                </Fragment>
            );
        }
        return (
            <Fragment>
                <SubHeader content="Koszyk" />
                <CartProducts {...this.props} />
                <CartSummary {...this.props} />
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    cart: state.cart,
    products: state.cart.ids.map(i => state.products.data[i]),
    deliveryMethods: state.deliveryMethods.ids.map(i => state.deliveryMethods.data[i]),
    currentDeliveryMethod: state.deliveryMethods.data[state.deliveryMethods.currentId] || {},
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    incrementItemInCart(item) {
        dispatch(addToCart(item));
    },
    decrementItemInCart(item) {
        dispatch(decrementInCart(item));
    },
    removeItemFromCart(itemId) {
        dispatch(deleteFromCart(itemId));
    },
    setCurrentSupplier(deliveryMethod) {
        dispatch(setCurrentDeliveryMethod(deliveryMethod));
    },
    toggleBuyerDeliveryStepRequired(required) {
        if (required) {
            dispatch(requireBuyerDeliveryStep());
        } else {
            dispatch(skipBuyerDeliveryStep());
        }
    },
    checkout() {
        ownProps.history.push('/checkout');
    },
    handleGetDeliveryMethodsIfNeeded() {
        dispatch(getDeliveryMethodsIfNeeded());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(withStyles(styles)(Cart)));
