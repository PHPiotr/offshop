import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography/Typography';
import Stepper from '@material-ui/core/Stepper/Stepper';
import Step from '@material-ui/core/Step/Step';
import StepButton from '@material-ui/core/StepButton';
import StepLabel from '@material-ui/core/StepLabel/StepLabel';
import Button from '@material-ui/core/Button/Button';
import Paper from '@material-ui/core/Paper/Paper';
import Review from './Review';
import PropTypes from 'prop-types';
import BuyerForm from "./BuyerForm";
import BuyerDeliveryForm from "./BuyerDeliveryForm";
import {getFormValues, isValid} from 'redux-form';
import {stepBack, stepNext, setActiveStepId} from '../../actions/checkout';
import {withRouter} from 'react-router-dom';
import steps from '../../config/checkoutSteps';

const styles = theme => ({
    paper: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        marginTop: 0,
        marginBottom: theme.spacing(3),
        [theme.breakpoints.up(600 + theme.spacing(6))]: {
            marginTop: 0,
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
        width: '100%',
        boxShadow: 'none',
        background: 'none',
    },
    stepper: {
        padding: `${theme.spacing(3)}px 0 ${theme.spacing(5)}px`,
        background: 'none',
    },
    step: {
        paddingLeft: '3px',
        paddingRight: '3px',
    },
    buttons: {
        display: 'flex',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: 0,
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

const Checkout = props => {
    const {classes, activeStepId, stepsIds, handleSetActiveStepId} = props;

    const activeStepValue = steps[activeStepId].value;
    let canProceed = false;
    if (activeStepValue === 'buyer') {
        canProceed = props.validBuyerData;
    } else if (activeStepValue === 'buyerDelivery') {
        canProceed = props.validBuyerData && props.validBuyerDeliveryData;
    }

    const handleOnStepButtonClick = id => () => handleSetActiveStepId(id);

    return (
        <Paper className={classes.paper}>
            <Stepper activeStep={activeStepId} className={classes.stepper}>
                {stepsIds.map(id => (
                    <Step key={id} className={classes.step}>
                        {(id < activeStepId) ? (
                            <StepButton onClick={handleOnStepButtonClick(id)}>
                                <StepLabel>{steps[id].label}</StepLabel>
                            </StepButton>
                        ) : (
                            <StepLabel>{steps[id].label}</StepLabel>
                        )}
                    </Step>
                ))}
            </Stepper>
            <Fragment>
                <Typography variant="h6" gutterBottom>
                    {steps[activeStepId].label}
                </Typography>
                {getStepContent(activeStepId)}
                <div className={classes.buttons}>
                    <Button
                        variant="contained"
                        color="disabled"
                        onClick={activeStepId === stepsIds[0] ? props.redirectToCart : props.handleBack}
                        className={classes.button}
                        style={{marginRight: '1rem'}}
                    >Wróć</Button>
                    {activeStepId !== stepsIds[stepsIds.length - 1] && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={props.handleNext}
                            className={classes.button}
                            disabled={!canProceed}
                        >Dalej</Button>
                    )}
                </div>
            </Fragment>
        </Paper>
    );
};

Checkout.propTypes = {
    classes: PropTypes.object.isRequired,
    activeStepId: PropTypes.number.isRequired,
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
    validBuyerData: isValid('buyer')(state),
    validBuyerDeliveryData: isValid('buyerDelivery')(state),
    buyer: getFormValues('buyer')(state),
    buyerDelivery: getFormValues('buyerDelivery')(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    handleNext() {
        dispatch(stepNext());
    },
    handleBack() {
        dispatch(stepBack());
    },
    handleSetActiveStepId(id) {
        dispatch(setActiveStepId(id));
    },
    redirectToCart() {
        ownProps.history.replace('/cart');
    },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Checkout)));
