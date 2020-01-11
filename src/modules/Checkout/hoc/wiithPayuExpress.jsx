import React, {Component, Fragment} from 'react';
import sha256 from 'crypto-js/sha256';
import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet';

const generateSig = ({
                         currencyCode,
                         customerEmail,
                         customerLanguage,
                         merchantPosId,
                         payuBrand,
                         recurringPayment,
                         shopName,
                         storeCard,
                         totalAmount,
                         widgetMode,
                         secondKeyMd5
                     }) => sha256(`${currencyCode}${customerEmail}${customerLanguage}${merchantPosId}${payuBrand}${recurringPayment}${shopName}${storeCard}${totalAmount}${widgetMode}${secondKeyMd5}`).toString();

const withPayuExpress = (WrappedComponent) => {

    class PayU extends Component {

        state = {
            sig: "",
        };

        constructor(props) {
            super(props);
            this.onSuccess = this.onSuccess.bind(this);
        }

        componentDidMount() {
            this.setState({sig: generateSig(this.props)});
            window.addEventListener('message', this.onSuccess);
        }

        componentDidUpdate(prevProps, prevState, snapshot) {
            if (
                prevProps.currencyCode !== this.props.currencyCode ||
                prevProps.customerEmail !== this.props.customerEmail ||
                prevProps.customerLanguage !== this.props.customerLanguage ||
                prevProps.merchantPosId !== this.props.merchantPosId ||
                prevProps.payuBrand !== this.props.payuBrand ||
                prevProps.recurringPayment !== this.props.recurringPayment ||
                prevProps.shopName !== this.props.shopName ||
                prevProps.storeCard !== this.props.storeCard ||
                prevProps.totalAmount !== this.props.totalAmount ||
                prevProps.widgetMode !== this.props.widgetMode ||
                prevProps.secondKeyMd5 !== this.props.secondKeyMd5
            ) {
                this.setState({sig: generateSig(this.props)});
            }
        }

        async onSuccess(e) {
            if (
                e.data &&
                e.data.service === 'MerchantService' &&
                e.target &&
                e.target.PayU &&
                e.target.PayU.Merchant &&
                e.target.PayU.Merchant.sig === this.state.sig &&
                e.data.message &&
                e.data.message.data &&
                e.data.message.data
            ) {
                const {value, type} = e.data.message.data;
                const payMethods = {
                    payMethod: {
                        value,
                        type,
                    }
                };
                try {
                    await this.props.createOrderIfNeeded(payMethods);
                } catch(e) {
                    this.props.handleCreateOrderError(e);
                }
            }
        }

        render() {
            return (
                <Fragment>
                    <Helmet>
                        <script
                            currency-code={this.props.currencyCode}
                            customer-email={this.props.customerEmail}
                            customer-language={this.props.customerLanguage}
                            merchant-pos-id={this.props.merchantPosId}
                            payu-brand={this.props.payuBrand}
                            pay-button={this.props.payButton}
                            recurring-payment={this.props.recurringPayment}
                            shop-name={this.props.shopName}
                            sig={this.state.sig}
                            src={this.props.src}
                            store-card={this.props.storeCard}
                            total-amount={this.props.totalAmount}
                            widget-mode={this.props.widgetMode}
                        >
                        </script>
                    </Helmet>
                    <WrappedComponent {...this.props}/>
                </Fragment>
            );
        }
    }

    PayU.propTypes = {
        createOrderIfNeeded: PropTypes.func.isRequired,
        currencyCode: PropTypes.string.isRequired,
        customerEmail: PropTypes.string.isRequired,
        customerLanguage: PropTypes.string.isRequired,
        handleCreateOrderError: PropTypes.func.isRequired,
        merchantPosId: PropTypes.string.isRequired,
        payButton: PropTypes.string,
        payuBrand: PropTypes.oneOf(['true', 'false']),
        recurringPayment: PropTypes.oneOf(['true', 'false']),
        secondKeyMd5: PropTypes.string.isRequired,
        shopName: PropTypes.string.isRequired,
        src: PropTypes.string.isRequired,
        storeCard: PropTypes.oneOf(['true', 'false']),
        totalAmount: PropTypes.string.isRequired,
        widgetMode: PropTypes.oneOf(['pay', 'use']),
    };

    PayU.defaultProps = {
        payButton: '#pay-button',
        payuBrand: 'true',
        recurringPayment: 'false',
        storeCard: 'false',
        widgetMode: 'pay',
    };

    return PayU;
};

export default withPayuExpress;
