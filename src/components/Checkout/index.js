import React, { Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography/Typography';
import Stepper from '@material-ui/core/Stepper/Stepper';
import Step from '@material-ui/core/Step/Step';
import StepLabel from '@material-ui/core/StepLabel/StepLabel';
import Button from '@material-ui/core/Button/Button';
import Paper from '@material-ui/core/Paper/Paper';
import AddressForm from './AddressForm';
import Review from './Review';
import PropTypes from 'prop-types';

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

const getStepContent = activeStep => {
    switch (activeStep) {
        case 1:
            return <Review />;
        case 0:
        default:
            return <AddressForm />;
    }
};

const Checkout = props => {
    const { classes, activeStep, steps, products, orderData } = props;

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
                            Dziękujemy za zakupy.
                        </Typography>
                        <Typography variant="subtitle1">
                            {`Numer Twojego zamówienia to: ${orderData.extOrderId}.`}
                        </Typography>
                        <Typography variant="subtitle1">
                            {`Więcej szczegółów znajdziesz w wiadomości, którą wysłaliśmy na Twój adres: ${orderData.buyer.email}.`}
                        </Typography>
                    </Fragment>
                ) : (
                    <Fragment>
                        <Typography variant="h6" gutterBottom>
                            {steps[activeStep]}
                        </Typography>
                        {getStepContent(props.activeStep)}
                        <div className={classes.buttons}>
                            {activeStep !== 0 && (
                                <Button
                                    onClick={props.handleBack}
                                    className={classes.button}
                                >
                                    Wróć
                                </Button>
                            )}
                            {activeStep < steps.length - 1 && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={props.handleNext}
                                    className={classes.button}
                                    disabled={!props.validShippingData}
                                >
                                    Dalej
                                </Button>
                            )}
                            <div
                                id="google-pay-btn-wrapper"
                                className={classes.button}
                                style={{
                                    display:
                                        activeStep === steps.length - 1 &&
                                        props.validShippingData &&
                                        products.length > 0
                                            ? 'block'
                                            : 'none',
                                }}
                            />
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
