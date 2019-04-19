import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import * as PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import withGooglePay from '../../../../hoc/withGooglePay';
import {createOrderIfNeeded, handleCreateOrderError} from '../../../../actions/order';

const styles = theme => ({
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit,
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
    googlePayButtonParentId: 'google-pay-btn-wrapper',
    totalPrice: ((state.cart.totalPrice + state.deliveryMethods.data[state.deliveryMethods.currentId].unitPrice * 100 * state.cart.quantity) / 100).toFixed(2),
    apiVersion: parseInt(process.env.REACT_APP_GOOGLE_PAY_API_VERSION, 10),
    apiVersionMinor: parseInt(process.env.REACT_APP_GOOGLE_PAY_API_VERSION_MINOR, 10),
    baseCardPaymentMethodType: process.env.REACT_APP_GOOGLE_PAY_BASE_CARD_PAYMENT_METHOD_TYPE,
    baseCardPaymentMethodAllowedAuthMethods: process.env.REACT_APP_GOOGLE_PAY_ALLOWED_CARD_AUTH_METHODS.split(','),
    baseCardPaymentMethodAllowedCardNetworks: process.env.REACT_APP_GOOGLE_PAY_ALLOWED_CARD_NETWORKS.split(','),
    tokenizationSpecificationType: process.env.REACT_APP_GOOGLE_PAY_TOKENIZATION_TYPE,
    tokenizationSpecificationGateway: process.env.REACT_APP_GOOGLE_PAY_TOKENIZATION_GATEWAY,
    tokenizationSpecificationGatewayMerchantId: process.env.REACT_APP_GOOGLE_PAY_TOKENIZATION_GATEWAY_MERCHANT_ID,
    merchantName: process.env.REACT_APP_MERCHANT_NAME,
    totalPriceStatus: process.env.REACT_APP_TOTAL_PRICE_STATUS,
    googlePayMethodValue: process.env.REACT_APP_PAYU_METHOD_VALUE_GOOGLE_PAY,
    googlePayMethodType: process.env.REACT_APP_PAYU_METHOD_TYPE_GOOGLE_PAY,
    currencyCode: process.env.REACT_APP_CURRENCY_CODE,
});

export default withRouter(connect(mapStateToProps, {createOrderIfNeeded, handleCreateOrderError})(withStyles(styles)(withGooglePay(GooglePay))));
