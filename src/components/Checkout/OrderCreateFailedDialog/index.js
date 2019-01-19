import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {toggleCreateOrderFailedDialog} from "../../../actions/checkout";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import {withStyles} from '@material-ui/core/styles';

const DialogTitle = withStyles(theme => ({
    root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        margin: 0,
        marginBottom: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 2,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: theme.spacing.unit,
        color: theme.palette.grey[500],
    },
}))(props => {
    const {children, classes, handleClose} = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            <IconButton aria-label="Close" className={classes.closeButton} onClick={handleClose}>
                <CloseIcon/>
            </IconButton>
        </MuiDialogTitle>
    );
});

const OrderCreateFailedDialog = props => {
    if (!props.dialogOpen) {
        return null;
    }
    return (
        <Dialog open={props.dialogOpen} onClose={props.handleClose} aria-labelledby="order-create-failed">
            <DialogTitle handleClose={props.handleClose}>Wystąpił nieoczekiwany błąd</DialogTitle>
            <DialogContent>
                <Typography>
                    {props.errorMessage}
                </Typography>
            </DialogContent>
        </Dialog>
    );
};

const mapStateToProps = state => ({
    dialogOpen: state.checkout.createOrderFailedDialogOpen,
    errorMessage: state.order.error,
});

const mapDispatchToProps = dispatch => ({
    handleClose() {
        dispatch(toggleCreateOrderFailedDialog());
    }
});

OrderCreateFailedDialog.propTypes = {
    dialogOpen: PropTypes.bool,
    errorMessage: PropTypes.string,
    handleClose: PropTypes.func.isRequired,
};

OrderCreateFailedDialog.defaultProps = {
    dialogOpen: false,
    errorMessage: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderCreateFailedDialog);
