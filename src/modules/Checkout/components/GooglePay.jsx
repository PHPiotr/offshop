import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import * as PropTypes from 'prop-types';
import {connect} from 'react-redux';
import withGooglePay from '../hoc/withGooglePay';
import {createOrderIfNeeded, handleCreateOrderError} from '../actions';

const styles = theme => ({
    button: {
        marginTop: theme.spacing(1),
        marginLeft: 0,
    },
});

const GooglePay = ({classes, googlePayButtonParentId}) => (
    <div
        id={googlePayButtonParentId}
        className={classes.button}
    />
);

GooglePay.propTypes = {
    classes: PropTypes.object.isRequired,
    googlePayButtonParentId: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
    totalPrice: (state.cart.totalPriceWithDelivery / 100).toFixed(2),
});

export default connect(mapStateToProps, {createOrderIfNeeded, handleCreateOrderError})(withStyles(styles)(withGooglePay(GooglePay)));
