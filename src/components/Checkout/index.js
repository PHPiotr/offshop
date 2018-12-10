import React, {Fragment} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography/Typography";
import Stepper from "@material-ui/core/Stepper/Stepper";
import Step from "@material-ui/core/Step/Step";
import StepLabel from "@material-ui/core/StepLabel/StepLabel";
import Button from "@material-ui/core/Button/Button";
import Paper from "@material-ui/core/Paper/Paper";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import PropTypes from "prop-types";

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

const getStepContent = step => {
    switch (step) {
        case 0:
            return <AddressForm/>;
        case 1:
            return <PaymentForm/>;
        case 2:
            return <Review/>;
        default:
            throw new Error('Unknown step');
    }
};

const Checkout = props => {
    const {classes, activeStep, steps} = props;

    return (
        <Paper className={classes.paper}>
            <Stepper activeStep={activeStep} className={classes.stepper}>
                {steps.map(label => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Fragment>
                {activeStep === steps.length ? (
                    <Fragment>
                        <Typography variant="h5" gutterBottom>
                            Thank you for your order.
                        </Typography>
                        <Typography variant="subtitle1">
                            Your order number is #2001539. We have emailed your order confirmation, and will
                            send you an update when your order has shipped.
                        </Typography>
                    </Fragment>
                ) : (
                    <Fragment>
                        {getStepContent(activeStep)}
                        <div className={classes.buttons}>
                            {activeStep !== 0 && (
                                <Button onClick={props.handleBack} className={classes.button}>
                                    Back
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={props.handleNext}
                                className={classes.button}
                            >
                                {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                            </Button>
                        </div>
                    </Fragment>
                )}
            </Fragment>
        </Paper>
    );
};

Checkout.propTypes = {
    classes: PropTypes.object.isRequired,
    activeStep: PropTypes.number.isRequired,
    steps: PropTypes.array.isRequired,
    handleBack: PropTypes.func.isRequired,
    handleNext: PropTypes.func.isRequired,
};

export default withStyles(styles)(Checkout);