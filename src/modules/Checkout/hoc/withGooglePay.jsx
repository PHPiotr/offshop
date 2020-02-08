import React, {Component} from 'react';
import PropTypes from 'prop-types';

const withGooglePay = (WrappedComponent) => {

    class GooglePay extends Component {

        paymentDataRequest = {
            allowedPaymentMethods: [
                {
                    parameters: {
                        allowedAuthMethods: this.props.baseCardPaymentMethodAllowedAuthMethods,
                        allowedCardNetworks: this.props.baseCardPaymentMethodAllowedCardNetworks,
                    },
                    tokenizationSpecification: {
                        parameters: {
                            gateway: this.props.tokenizationSpecificationGateway,
                            gatewayMerchantId: this.props.tokenizationSpecificationGatewayMerchantId,
                        },
                        type: this.props.tokenizationSpecificationType,
                    },
                    type: this.props.baseCardPaymentMethodType,
                }
            ],
            apiVersion: this.props.apiVersion,
            apiVersionMinor: this.props.apiVersionMinor,
            merchantInfo: {
                merchantName: this.props.merchantName,
            },
            transactionInfo: {
                currencyCode: this.props.currencyCode,
                totalPrice: this.props.totalPrice,
                totalPriceStatus: this.props.totalPriceStatus,
            }
        };

        isReadyToPayRequest = {
            allowedPaymentMethods: [
                {
                    parameters: {
                        allowedAuthMethods: this.props.baseCardPaymentMethodAllowedAuthMethods,
                        allowedCardNetworks: this.props.baseCardPaymentMethodAllowedCardNetworks,
                    },
                    type: this.props.baseCardPaymentMethodType,
                }
            ],
            apiVersion: this.props.apiVersion,
            apiVersionMinor: this.props.apiVersionMinor,
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
            script.addEventListener('load', this.handleOnLoadGooglePay);
        };

        async handleOnLoadGooglePay() {
            try {
                const {environment} = this.props;
                const paymentsClient = new google.payments.api.PaymentsClient({environment});
                await paymentsClient.isReadyToPay(this.isReadyToPayRequest);

                const onClick = () => this.handleOnClickGooglePayButton(paymentsClient);
                const googlePayButton = paymentsClient.createButton({onClick});

                const buttonWrapperElem = document.getElementById(this.props.googlePayButtonParentId);
                googlePayButton && buttonWrapperElem && buttonWrapperElem.appendChild(googlePayButton);
            } catch (e) {
                this.props.handleCreateOrderError(e);
            }
        }

        async handleOnClickGooglePayButton(paymentsClient) {
            try {
                const paymentData = await paymentsClient.loadPaymentData(this.paymentDataRequest);
                const {paymentMethodData} = paymentData;
                const payMethods = {
                    payMethod: {
                        authorizationCode: btoa(paymentMethodData.tokenizationData.token),
                        type: this.props.googlePayMethodType,
                        value: this.props.googlePayMethodValue,
                    },
                };
                await this.props.createOrderIfNeeded(payMethods);
            } catch(e) {
                this.props.handleCreateOrderError(e);
            }
        }
    }

    GooglePay.propTypes = {
        apiVersion: PropTypes.number.isRequired,
        apiVersionMinor: PropTypes.number.isRequired,
        baseCardPaymentMethodAllowedAuthMethods: PropTypes.arrayOf(PropTypes.string).isRequired,
        baseCardPaymentMethodAllowedCardNetworks: PropTypes.arrayOf(PropTypes.string).isRequired,
        baseCardPaymentMethodType: PropTypes.string.isRequired,
        createOrderIfNeeded: PropTypes.func.isRequired,
        currencyCode: PropTypes.string.isRequired,
        environment: PropTypes.string,
        googlePayButtonParentId: PropTypes.string.isRequired,
        googlePayMethodValue: PropTypes.string.isRequired,
        googlePayMethodType: PropTypes.string.isRequired,
        googlePayScriptId: PropTypes.string,
        googlePayScriptSrc: PropTypes.string,
        handleCreateOrderError: PropTypes.func.isRequired,
        merchantName: PropTypes.string.isRequired,
        tokenizationSpecificationGateway: PropTypes.string.isRequired,
        tokenizationSpecificationGatewayMerchantId: PropTypes.string.isRequired,
        tokenizationSpecificationType: PropTypes.string.isRequired,
        totalPrice: PropTypes.string.isRequired,
        totalPriceStatus: PropTypes.string.isRequired,
    };

    GooglePay.defaultProps = {
        environment: 'TEST',
        googlePayScriptId: 'google-pay-script',
        googlePayScriptSrc: 'https://pay.google.com/gp/p/js/pay.js',
    };

    return GooglePay;
};

export default withGooglePay;
