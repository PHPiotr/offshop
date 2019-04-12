import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography/Typography';
import Stepper from '@material-ui/core/Stepper/Stepper';
import Step from '@material-ui/core/Step/Step';
import StepLabel from '@material-ui/core/StepLabel/StepLabel';
import Button from '@material-ui/core/Button/Button';
import Paper from '@material-ui/core/Paper/Paper';
import Review from './Review';
import PropTypes from 'prop-types';
import BuyerForm from "./BuyerForm";
import BuyerDeliveryForm from "./BuyerDeliveryForm";
import {getFormValues, isValid, formValueSelector} from 'redux-form';
import sha256 from 'crypto-js/sha256';
import {setActiveStepId, stepBack, stepNext} from '../../actions/checkout';
import {createOrder} from '../../actions/order';
import {showNotification} from '../../actions/notification';
import withGooglePay from '../../hoc/withGooglePay';
import {withRouter} from 'react-router-dom';
import GooglePayButton from './GooglePayButton';
import PayMethods from './PayMethods';
import withPayU from '../../hoc/withPayU';

const styles = theme => ({
    paper: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            marginTop: theme.spacing.unit * 6,
            marginBottom: theme.spacing.unit * 6,
            padding: theme.spacing.unit * 3,
        },
        width: '100%',
    },
    stepper: {
        padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`,
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

const getStepContent = activeStepId => {
    switch (activeStepId) {
        case 0:
        default:
            return <BuyerForm/>;
        case 1:
            return <BuyerDeliveryForm/>;
        case 2:
            return <Review/>;
    }
};

const handleClick = function () {

    debugger;

    const OpenPayU = window.OpenPayU;

    OpenPayU.merchantId = process.env.REACT_APP_POS_ID;
    let d;
    var result = OpenPayU.Token.create({}, function (data) {
        d = data;
        console.log(data);
        // obsłuż rezultat tokenizacji, możliwe kody odpowiedzi są poniżej
    });
    if (!result) {
        debugger;
        // żądanie tokenizacji nie zostało wysłane,
        // sprawdź błędy walidacji w obiekcie "result"
    }
    while (!d) {

    }
};

const Checkout = props => {
    const {classes, activeStepId, stepsIds, steps, showGooglePayButton} = props;

    const activeStepValue = steps[activeStepId].value;
    let canProceed = false;
    if (activeStepValue === 'buyer') {
        canProceed = props.validBuyerData;
    } else if (activeStepValue === 'buyerDelivery') {
        canProceed = props.validBuyerData && props.validBuyerDeliveryData;
    }

    return (
        <Paper className={classes.paper}>
            <Stepper activeStep={activeStepId} className={classes.stepper}>
                {stepsIds.map(id => (
                    <Step key={id}>
                        <StepLabel>{steps[id].label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Fragment>
                <Typography variant="h6" gutterBottom>
                    {steps[activeStepId].label}
                </Typography>
                {getStepContent(activeStepId)}
                <div className={classes.buttons}>
                    <Button onClick={activeStepId === stepsIds[0] ? props.redirectToCart : props.handleBack} className={classes.button}>Wróć</Button>
                    {activeStepId !== stepsIds[stepsIds.length - 1] && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={props.handleNext}
                            className={classes.button}
                            disabled={!canProceed}
                        >
                            Dalej
                        </Button>
                    )}
                    <GooglePayButton show={showGooglePayButton}/>
                    <table>
                        <tr>
                            <td>Numer karty</td>
                            <td><input type="text" className="payu-card-number"/></td>
                        </tr>
                        <tr>
                            <td>CVV2/CVC2</td>
                            <td><input type="text" className="payu-card-cvv"/></td>
                        </tr>
                        <tr>
                            <td>miesiąc</td>
                            <td><input type="text" className="payu-card-expm"/></td>
                        </tr>
                        <tr>
                            <td>rok</td>
                            <td><input type="text" className="payu-card-expy"/></td>
                        </tr>
                        <tr>
                            <td>Akceptacja regulaminu Konta PayU i zgoda na zapisanie karty</td>
                            <td><input type="checkbox" value="false" className="payu-agreement"/></td>
                        </tr>
                        {/*<input type="hidden" className="payu-customer-email" value="...@..."/>*/}
                            <tr>
                                <td><input type="submit" id="payu-cc-form-submit" onClick={handleClick}/></td>
                            </tr>
                    </table>
                </div>
            </Fragment>
        </Paper>
    );
};

Checkout.propTypes = {
    classes: PropTypes.object.isRequired,
    activeStepId: PropTypes.number.isRequired,
    steps: PropTypes.object.isRequired,
    stepsIds: PropTypes.array.isRequired,
    handleBack: PropTypes.func.isRequired,
    handleNext: PropTypes.func.isRequired,
    redirectToCart: PropTypes.func.isRequired,
    validBuyerData: PropTypes.bool.isRequired,
    validBuyerDeliveryData: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    activeStepId: state.checkout.activeStepId || 0,
    stepsIds: state.checkout.stepsIds,
    steps: state.checkout.steps,
    validBuyerData: isValid('buyer')(state),
    validBuyerDeliveryData: isValid('buyerDelivery')(state),
    buyer: getFormValues('buyer')(state),
    buyerDelivery: getFormValues('buyerDelivery')(state),
    showGooglePayButton: state.checkout.activeStepId === state.checkout.stepsIds[state.checkout.stepsIds.length - 1],
    totalPrice: state.deliveryMethods.currentId ? state.cart.totalPrice + state.deliveryMethods.data[state.deliveryMethods.currentId].unitPrice * 100 * state.cart.quantity : state.cart.totalPrice,
    sig: sha256(process.env.REACT_APP_CURRENCY_CODE + formValueSelector('buyer')(state, 'email') + 'pl' + process.env.REACT_APP_POS_ID + 'true' + 'false' + process.env.REACT_APP_MERCHANT_NAME + 'false' + (state.deliveryMethods.currentId ? state.cart.totalPrice + state.deliveryMethods.data[state.deliveryMethods.currentId].unitPrice * 100 * state.cart.quantity : state.cart.totalPrice) + 'pay'),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    handleNext() {
        dispatch(stepNext());
    },
    handleBack() {
        dispatch(stepBack());
    },
    redirectToCart() {
        ownProps.history.replace('/cart');
    },
    async onGooglePayButtonClick(paymentDataFromGooglePay) {
        try {
            const payload = await dispatch(createOrder(paymentDataFromGooglePay));
            const {redirectUri} = payload;
            if (redirectUri) {
                window.location.href = redirectUri;
            } else {
                dispatch(setActiveStepId(0));
                ownProps.history.replace('/order');
            }
        } catch (e) {
            dispatch(setActiveStepId(2));
            dispatch(showNotification({message: e.message, variant: 'error'}));
        }
    },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withGooglePay(withPayU(Checkout)))));
