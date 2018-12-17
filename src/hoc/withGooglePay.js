import React, {Component} from 'react';
import PropTypes from 'prop-types';

const baseRequest = {
    apiVersion: parseInt(process.env.REACT_APP_GOOGLE_PAY_API_VERSION, 10),
    apiVersionMinor: parseInt(process.env.REACT_APP_GOOGLE_PAY_API_VERSION_MINOR, 10),
};

const tokenizationSpecification = {
    type: process.env.REACT_APP_GOOGLE_PAY_TOKENIZATION_TYPE,
    parameters: {
        gateway: process.env.REACT_APP_GOOGLE_PAY_TOKENIZATION_GATEWAY,
        gatewayMerchantId: process.env.REACT_APP_GOOGLE_PAY_TOKENIZATION_GATEWAY_MERCHANT_ID,
    }
};

const allowedCardNetworks = process.env.REACT_APP_GOOGLE_PAY_ALLOWED_CARD_NETWORKS.split(',');
const allowedCardAuthMethods = process.env.REACT_APP_GOOGLE_PAY_ALLOWED_CARD_AUTH_METHODS.split(',');

const baseCardPaymentMethod = {
    type: process.env.REACT_APP_GOOGLE_PAY_BASE_CARD_PAYMENT_METHOD_TYPE,
    parameters: {
        allowedAuthMethods: allowedCardAuthMethods,
        allowedCardNetworks: allowedCardNetworks,
    },
};

const cardPaymentMethod = {...baseCardPaymentMethod, tokenizationSpecification: tokenizationSpecification};

const paymentDataRequest = {...baseRequest};

paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
paymentDataRequest.merchantInfo = {
    merchantName: process.env.REACT_APP_MERCHANT_NAME,
};

paymentDataRequest.transactionInfo = {
    totalPriceStatus: process.env.REACT_APP_TOTAL_PRICE_STATUS,
    currencyCode: process.env.REACT_APP_CURRENCY_CODE,
};

let googlePayButton = null;

function withGooglePay(WrappedComponent) {

    class GooglePay extends Component {

        state = {
            paymentsClient: null,
            totalPrice: this.props.totalPrice,
        };

        componentDidMount() {
            const {props} = this;
            const {totalPrice} = props;
            const script = document.createElement('script');
            script.src = 'https://pay.google.com/gp/p/js/pay.js';
            script.type = 'text/javascript';
            script.async = true;
            document.body.appendChild(script);
            script.onload = () => {
                // eslint-disable-next-line no-undef
                const paymentsClient = new google.payments.api.PaymentsClient({
                    environment: process.env.REACT_APP_GOOGLE_PAYMENTS_ENV || 'TEST',
                });
                this.setState({...this.state, paymentsClient});

                const isReadyToPayRequest = {...baseRequest};

                isReadyToPayRequest.allowedPaymentMethods = [baseCardPaymentMethod];

                paymentsClient.isReadyToPay(isReadyToPayRequest).then((response) => {
                    if (response.result) {
                        googlePayButton = paymentsClient.createButton({
                            onClick: () => {
                                paymentDataRequest.transactionInfo.totalPrice = parseFloat(totalPrice).toFixed(2).toString();
                                paymentsClient.loadPaymentData(paymentDataRequest)
                                    .then(paymentData => this.props.onGooglePayButtonClick(paymentData, props))
                                    .catch(e => console.error(e));
                            }
                        });
                        googlePayButton && document.getElementById(this.props.googlePayButtonParentId).appendChild(googlePayButton);
                    }
                }).catch(function (err) {
                    // show error in developer console for debugging
                    console.error(err);
                });

            };
        }

        componentWillReceiveProps(prevProps, nextProps) {
            console.log('prev, next', prevProps, nextProps);
        }

        render() {
            if (!this.state.paymentsClient) {
                return null;
            }
            return <WrappedComponent
                paymentsClient={this.state.paymentsClient}
                {...this.props}
            />;
        }
    }

    GooglePay.propTypes = {
        onGooglePayButtonClick: PropTypes.func.isRequired,
        googlePayButtonParentId: PropTypes.string,
        totalPrice: PropTypes.number.isRequired,
        products: PropTypes.array.isRequired,
    };

    GooglePay.defaultProps = {
        googlePayButtonParentId: 'google-pay-btn-wrapper',
    };

    return GooglePay;
}

export default withGooglePay;
