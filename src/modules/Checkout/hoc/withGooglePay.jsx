import React, {Component} from 'react';
import PropTypes from 'prop-types';

const isReadyToPayRequest = config => ({
    allowedPaymentMethods: [
        {
            parameters: {
                allowedAuthMethods: config.baseCardPaymentMethodAllowedAuthMethods,
                allowedCardNetworks: config.baseCardPaymentMethodAllowedCardNetworks,
            },
            type: config.baseCardPaymentMethodType,
        }
    ],
    apiVersion: config.apiVersion,
    apiVersionMinor: config.apiVersionMinor,
});

const paymentDataRequest = config => totalPrice => ({
    allowedPaymentMethods: [
        {
            parameters: {
                allowedAuthMethods: config.baseCardPaymentMethodAllowedAuthMethods,
                allowedCardNetworks: config.baseCardPaymentMethodAllowedCardNetworks,
            },
            tokenizationSpecification: {
                parameters: {
                    gateway: config.tokenizationSpecificationGateway,
                    gatewayMerchantId: config.tokenizationSpecificationGatewayMerchantId,
                },
                type: config.tokenizationSpecificationType,
            },
            type: config.baseCardPaymentMethodType,
        }
    ],
    apiVersion: config.apiVersion,
    apiVersionMinor: config.apiVersionMinor,
    merchantInfo: {
        merchantName: config.merchantName,
    },
    transactionInfo: {
        currencyCode: config.currencyCode,
        totalPrice,
        totalPriceStatus: config.totalPriceStatus,
    }
});

let buttonWrapperElem;

const withGooglePay = config => WrappedComponent => {

    class GooglePay extends Component {

        constructor(props) {
            super(props);
            this.setupGooglePay = this.setupGooglePay.bind(this);
            this.handleOnLoadGooglePay = this.handleOnLoadGooglePay.bind(this);
            this.handleOnClickGooglePayButton = this.handleOnClickGooglePayButton.bind(this);
        }

        componentDidMount() {
            buttonWrapperElem = document.getElementById(this.props.googlePayButtonParentId);
            this.setupGooglePay();
        }

        render() {
            return (
                <WrappedComponent {...this.props}/>
            );
        }

        setupGooglePay = () => {
            const script = document.createElement('script');
            script.src = config.googlePayScriptSrc;
            script.type = 'text/javascript';
            script.async = true;
            script.id = config.googlePayScriptId;
            document.body.appendChild(script);
            script.addEventListener('load', this.handleOnLoadGooglePay);
        };

        async handleOnLoadGooglePay() {
            try {
                const paymentsClient = new google.payments.api.PaymentsClient({environment: config.environment});
                await paymentsClient.isReadyToPay(isReadyToPayRequest(config));

                const onClick = () => this.handleOnClickGooglePayButton(paymentsClient);
                const googlePayButton = paymentsClient.createButton({onClick});

                googlePayButton && buttonWrapperElem && buttonWrapperElem.appendChild(googlePayButton);
            } catch (e) {
                this.props.handleCreateOrderError(e);
            }
        }

        async handleOnClickGooglePayButton(paymentsClient) {
            try {
                const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest(config)(this.props.totalPrice));
                const {paymentMethodData} = paymentData;
                const payMethods = {
                    payMethod: {
                        authorizationCode: btoa(paymentMethodData.tokenizationData.token),
                        type: config.googlePayMethodType,
                        value: config.googlePayMethodValue,
                    },
                };
                await this.props.createOrderIfNeeded(payMethods);
            } catch(e) {
                if (e.statusCode !== 'CANCELED') {
                    this.props.handleCreateOrderError(e);
                }
            }
        }
    }

    GooglePay.propTypes = {
        createOrderIfNeeded: PropTypes.func.isRequired,
        handleCreateOrderError: PropTypes.func.isRequired,
        googlePayButtonParentId: PropTypes.string.isRequired,
        totalPrice: PropTypes.string.isRequired,
    };

    return GooglePay;
};

export default withGooglePay;
