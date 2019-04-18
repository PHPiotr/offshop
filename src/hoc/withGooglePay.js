import React, {Component} from 'react';
import PropTypes from 'prop-types';

const withGooglePay = (WrappedComponent) => {

    class GooglePay extends Component {

        paymentDataRequest = {
            apiVersion: this.props.apiVersion,
            apiVersionMinor: this.props.apiVersionMinor,
            allowedPaymentMethods: [
                {
                    type: this.props.baseCardPaymentMethodType,
                    parameters: {
                        allowedAuthMethods: this.props.baseCardPaymentMethodAllowedAuthMethods,
                        allowedCardNetworks: this.props.baseCardPaymentMethodAllowedCardNetworks,
                    },
                    tokenizationSpecification: {
                        type: this.props.tokenizationSpecificationType,
                        parameters: {
                            gateway: this.props.tokenizationSpecificationGateway,
                            gatewayMerchantId: this.props.tokenizationSpecificationGatewayMerchantId,
                        },
                    },
                }
            ],
            merchantInfo: {
                merchantName: this.props.merchantName,
            },
            transactionInfo: {
                totalPriceStatus: this.props.totalPriceStatus,
                currencyCode: this.props.currencyCode,
                totalPrice: this.props.totalPrice,
            }
        };

        isReadyToPayRequest = {
            apiVersion: this.props.apiVersion,
            apiVersionMinor: this.props.apiVersionMinor,
            allowedPaymentMethods: [
                {
                    type: this.props.baseCardPaymentMethodType,
                    parameters: {
                        allowedAuthMethods: this.props.baseCardPaymentMethodAllowedAuthMethods,
                        allowedCardNetworks: this.props.baseCardPaymentMethodAllowedCardNetworks,
                    },
                }
            ],
        };

        constructor(props) {
            super(props);
            this.setupGooglePay = this.setupGooglePay.bind(this);
            this.handleOnLoadGooglePay = this.handleOnLoadGooglePay.bind(this);
            this.handleOnClickGooglePayButton = this.handleOnClickGooglePayButton.bind(this);
        }

        componentDidMount() {
            this.setupGooglePay();
        }

        render() {
            return (
                <WrappedComponent {...this.props}/>
            );
        }

        setupGooglePay = () => {
            const script = document.createElement('script');
            script.src = this.props.googlePayScriptSrc;
            script.type = 'text/javascript';
            script.async = true;
            script.id = this.props.googlePayScriptId;
            document.body.appendChild(script);
            script.onload = this.handleOnLoadGooglePay;
        };

        async handleOnLoadGooglePay() {
            try {
                const {environment} = this.props;
                // eslint-disable-next-line no-undef
                const paymentsClient = new google.payments.api.PaymentsClient({environment});
                const response = await paymentsClient.isReadyToPay(this.isReadyToPayRequest);

                if (!response.result) {
                    throw new Error('Problem creating google pay button');
                }

                const handleOnClickGooglePayButton = this.handleOnClickGooglePayButton;
                const googlePayButton = await paymentsClient.createButton({
                    async onClick() {
                        return handleOnClickGooglePayButton(paymentsClient);
                    },
                });

                const buttonWrapperElem = document.getElementById(this.props.googlePayButtonParentId);
                googlePayButton && buttonWrapperElem && buttonWrapperElem.appendChild(googlePayButton);
            } catch (err) {
                this.props.handleGooglePayError(err);
            }
        }

        async handleOnClickGooglePayButton(paymentsClient) {
            try {
                const paymentData = await paymentsClient.loadPaymentData(this.paymentDataRequest);
                const {paymentMethodData} = paymentData;
                const payMethods = {
                    payMethod: {
                        value: this.props.googlePayMethodValue,
                        type: this.props.googlePayMethodType,
                        authorizationCode: btoa(paymentMethodData.tokenizationData.token),
                    },
                };

                return this.props.handleCreateOrderRequest(payMethods);
            } catch(err) {
                this.props.handleGooglePayError(err);
            }
        }
    }

    GooglePay.propTypes = {
        googlePayButtonParentId: PropTypes.string,
        handleCreateOrderRequest: PropTypes.func.isRequired,
        handleGooglePayError: PropTypes.func.isRequired,
        apiVersion: PropTypes.number.isRequired,
        apiVersionMinor: PropTypes.number.isRequired,
        baseCardPaymentMethodType: PropTypes.string.isRequired,
        baseCardPaymentMethodAllowedAuthMethods: PropTypes.arrayOf(PropTypes.string).isRequired,
        baseCardPaymentMethodAllowedCardNetworks: PropTypes.arrayOf(PropTypes.string).isRequired,
        tokenizationSpecificationType: PropTypes.string.isRequired,
        tokenizationSpecificationGateway: PropTypes.string.isRequired,
        tokenizationSpecificationGatewayMerchantId: PropTypes.string.isRequired,
        merchantName: PropTypes.string.isRequired,
        totalPriceStatus: PropTypes.string.isRequired,
        currencyCode: PropTypes.string.isRequired,
        totalPrice: PropTypes.string.isRequired,
        googlePayScriptSrc: PropTypes.string,
        googlePayScriptId: PropTypes.string,
        googlePayMethodValue: PropTypes.string.isRequired,
        googlePayMethodType: PropTypes.string.isRequired,
        environment: PropTypes.string,
    };

    GooglePay.defaultProps = {
        googlePayButtonParentId: 'google-pay-btn-wrapper',
        googlePayScriptSrc: 'https://pay.google.com/gp/p/js/pay.js',
        googlePayScriptId: 'google-pay-script',
        environment: 'TEST',
    };

    return GooglePay;
};

export default withGooglePay;
