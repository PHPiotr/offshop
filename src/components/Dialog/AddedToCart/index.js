import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import {FormattedMessage} from "react-intl";

const AddedToCart = props => (
    <Dialog
        open={props.open}
        onClose={props.onContinueShoppingClick}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title"><FormattedMessage id="products.product_added_to_cart"/></DialogTitle>
        {props.content && (
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.content}
                </DialogContentText>
            </DialogContent>
        )}
        <DialogActions>
            <Button onClick={props.onContinueShoppingClick} color="primary">
                <FormattedMessage id="products.continue_shopping"/>
            </Button>
            <Button onClick={props.onGoToCartClick} color="primary">
                <FormattedMessage id="products.go_to_cart"/>
            </Button>
        </DialogActions>
    </Dialog>
);

AddedToCart.propTypes = {
    open: PropTypes.bool.isRequired,
    onContinueShoppingClick: PropTypes.func.isRequired,
    onGoToCartClick: PropTypes.func.isRequired,
    content: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

AddedToCart.defaultProps = {
    content: null,
};

export default AddedToCart;
