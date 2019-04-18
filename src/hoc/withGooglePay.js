import React, {Component} from 'react';
import PropTypes from 'prop-types';

const baseRequest = {
    apiVersion: parseInt(process.env.REACT_APP_GOOGLE_PAY_API_VERSION, 10),
    apiVersionMinor: parseInt(
        process.env.REACT_APP_GOOGLE_PAY_API_VERSION_MINOR,
        10
    ),
};

const tokenizationSpecification = {
    type: process.env.REACT_APP_GOOGLE_PAY_TOKENIZATION_TYPE,
    parameters: {
        gateway: process.env.REACT_APP_GOOGLE_PAY_TOKENIZATION_GATEWAY,
        gatewayMerchantId: process.env.REACT_APP_GOOGLE_PAY_TOKENIZATION_GATEWAY_MERCHANT_ID,
    },
};

const allowedCardNetworks = process.env.REACT_APP_GOOGLE_PAY_ALLOWED_CARD_NETWORKS.split(
    ','
);
const allowedCardAuthMethods = process.env.REACT_APP_GOOGLE_PAY_ALLOWED_CARD_AUTH_METHODS.split(
    ','
);

const baseCardPaymentMethod = {
    type: process.env.REACT_APP_GOOGLE_PAY_BASE_CARD_PAYMENT_METHOD_TYPE,
    parameters: {
        allowedAuthMethods: allowedCardAuthMethods,
        allowedCardNetworks: allowedCardNetworks,
    },
};

const cardPaymentMethod = {
    ...baseCardPaymentMethod,
    tokenizationSpecification: tokenizationSpecification,
};

const paymentDataRequest = { ...baseRequest };

paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
paymentDataRequest.merchantInfo = {
    merchantName: process.env.REACT_APP_MERCHANT_NAME,
};

paymentDataRequest.transactionInfo = {
    totalPriceStatus: process.env.REACT_APP_TOTAL_PRICE_STATUS,
    currencyCode: process.env.REACT_APP_CURRENCY_CODE,
};

let googlePayButton = null;

const onButtonClick = (paymentsClient, totalAmount, callback) => {
    paymentDataRequest.transactionInfo.totalPrice = (totalAmount / 100).toFixed(2).toString();
    paymentsClient.loadPaymentData(paymentDataRequest)
        .then(paymentData => {
            const { paymentMethodData } = paymentData;
            const payMethods = {
                payMethod: {
                    value: process.env.REACT_APP_PAYU_METHOD_VALUE_GOOGLE_PAY,
                    type: process.env.REACT_APP_PAYU_METHOD_TYPE_GOOGLE_PAY,
                    authorizationCode: btoa(paymentMethodData.tokenizationData.token),
                }
            };

            return callback(payMethods)
        })
        .catch(e => console.error(e));
};

const createButton = (response, paymentsClient, totalAmount, callbackOnGooglePayButtonClick) => {
    if (!response.result) {
        throw Error('Problem creating google pay button');
    }
    return paymentsClient.createButton({
        onClick() {
            onButtonClick(paymentsClient, totalAmount, callbackOnGooglePayButtonClick);
        },
    });
};

const withGooglePay = (WrappedComponent) => {

    class GooglePay extends Component {

        state = {
            googlePayButton: null,
        };

        setUpGooglePay = () => {
            const {totalAmount, handleCreateOrderRequest} = this.props;
            const script = document.createElement('script');
            script.src = 'https://pay.google.com/gp/p/js/pay.js';
            script.type = 'text/javascript';
            script.async = true;
            script.id = 'google-pay-script';
            document.body.appendChild(script);
            script.onload = () => {
                // eslint-disable-next-line no-undef
                const paymentsClient = new google.payments.api.PaymentsClient({
                    environment:
                        process.env.REACT_APP_GOOGLE_PAYMENTS_ENV || 'TEST',
                });

                const isReadyToPayRequest = {...baseRequest};
                isReadyToPayRequest.allowedPaymentMethods = [
                    baseCardPaymentMethod,
                ];

                paymentsClient.isReadyToPay(isReadyToPayRequest)
                    .then(response => {
                        googlePayButton = createButton(response, paymentsClient, totalAmount, handleCreateOrderRequest);
                        const buttonWrapperElem = document.getElementById(this.props.googlePayButtonParentId);
                        googlePayButton && buttonWrapperElem && buttonWrapperElem.appendChild(googlePayButton);
                    })
                    .catch(function (err) {
                        console.error(err);
                    });
            };
        };

        componentDidMount() {
            this.setUpGooglePay();
        }

        render() {
            return (
                <WrappedComponent {...this.props}/>
            );
        }
    }

    GooglePay.propTypes = {
        handleCreateOrderRequest: PropTypes.func.isRequired,
        googlePayButtonParentId: PropTypes.string,
        totalAmount: PropTypes.number.isRequired,
    };

    GooglePay.defaultProps = {
        googlePayButtonParentId: 'google-pay-btn-wrapper',
    };

    return GooglePay;
};

export default withGooglePay;
