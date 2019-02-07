import React, {Fragment} from 'react';
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

const Checkout = props => {
    const {classes, activeStepId, stepsIds, steps, products} = props;

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
                    {activeStepId != stepsIds[stepsIds.length - 1] && (
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
                    <div
                        id="google-pay-btn-wrapper"
                        className={classes.button}
                        style={{
                            display:
                                activeStepId === stepsIds[stepsIds.length - 1] &&
                                props.validBuyerData &&
                                props.validBuyerDeliveryData &&
                                products.length > 0
                                    ? 'block'
                                    : 'none',
                        }}
                    />
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
};

export default withStyles(styles)(Checkout);
