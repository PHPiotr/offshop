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

const onButtonClick = (paymentsClient, totalPrice, props, callback) => {
    paymentDataRequest.transactionInfo.totalPrice = parseFloat(
        totalPrice
    )
        .toFixed(2)
        .toString();
    paymentsClient
        .loadPaymentData(paymentDataRequest)
        .then(paymentData =>
            callback(
                paymentData,
                props
            )
        )
        .catch(e => console.error(e));
};

const createButton = (response, paymentsClient, totalPrice, props, callbackOnGooglePayButtonClick) => {
    if (!response.result) {
        throw Error('Problem creating google pay button');
    }
    return paymentsClient.createButton({
        onClick: () => onButtonClick(paymentsClient, totalPrice, props, callbackOnGooglePayButtonClick),
    });
};

const withGooglePay = (WrappedComponent) => {

    class GooglePay extends Component {

        state = {
            googlePayButton: null,
        };

        componentDidMount() {
            const {totalPrice, onGooglePayButtonClick} = this.props;
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
                        googlePayButton = createButton(response, paymentsClient, totalPrice, this.props, onGooglePayButtonClick);
                        this.setState({...this.state, googlePayButton});
                        googlePayButton && document.getElementById(this.props.googlePayButtonParentId).appendChild(googlePayButton);
                    })
                    .catch(function (err) {
                        console.error(err);
                    });
            };
        }

        render() {
            return (
                <WrappedComponent
                    googlePayButton={this.state.googlePayButton}
                    {...this.props}
                />
            );
        }
    }

    GooglePay.propTypes = {
        onGooglePayButtonClick: PropTypes.func.isRequired,
        googlePayButtonParentId: PropTypes.string,
        totalPrice: PropTypes.number.isRequired,
        products: PropTypes.array.isRequired,
        buyer: PropTypes.object.isRequired,
    };

    GooglePay.defaultProps = {
        googlePayButtonParentId: 'google-pay-btn-wrapper',
    };

    return GooglePay;
};

export default withGooglePay;
