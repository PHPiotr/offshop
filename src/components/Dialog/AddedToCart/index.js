import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import {
    ADDED_TO_BASKET_DIALOG_TITLE,
    CONTINUE_SHOPPING_BUTTON_LABEL,
    GO_TO_BASKET_BUTTON_LABEL,
} from "../../../constants/pl/addedToCartDialog";

const AddedToCart = (props) => (
    <Dialog
        open={props.open}
        onClose={props.onContinueShoppingClick}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        {props.content && <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {props.content}
            </DialogContentText>
        </DialogContent>}
        <DialogActions>
            <Button onClick={props.onContinueShoppingClick} color="primary">
                {props.continueShoppingButtonLabel}
            </Button>
            <Button onClick={props.onGoToBasketClick} color="primary">
                {props.goToBasketButtonLabel}
            </Button>
        </DialogActions>
    </Dialog>
);

AddedToCart.propTypes = {
    open: PropTypes.bool.isRequired,
    onContinueShoppingClick: PropTypes.func.isRequired,
    onGoToBasketClick: PropTypes.func.isRequired,
    continueShoppingButtonLabel: PropTypes.string,
    goToBasketButtonLabel: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

AddedToCart.defaultProps = {
    title: ADDED_TO_BASKET_DIALOG_TITLE,
    continueShoppingButtonLabel: CONTINUE_SHOPPING_BUTTON_LABEL,
    goToBasketButtonLabel: GO_TO_BASKET_BUTTON_LABEL,
    content: null,
};

export default AddedToCart;
