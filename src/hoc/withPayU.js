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

const withPayU = (WrappedComponent) => {

    class PayU extends Component {

        state = {
            payUButton: null,
        };

        render() {

            return (
                <Fragment>
                    <Helmet>
                        <script
                            pay-button={this.props.payButton}
                            sig={generateSig(this.props)}
                            src={this.props.src}
                            success-callback={this.props.successCallback}
                            currency-code={this.props.currencyCode}
                            customer-email={this.props.customerEmail}
                            customer-language={this.props.customerLanguage}
                            merchant-pos-id={this.props.merchantPosId}
                            payu-brand={this.props.payuBrand}
                            recurring-payment={this.props.recurringPayment}
                            shop-name={this.props.shopName}
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
        payButton: PropTypes.string,
        src: PropTypes.string.isRequired,
        successCallback: PropTypes.string.isRequired,
        currencyCode: PropTypes.string.isRequired,
        customerEmail: PropTypes.string.isRequired,
        customerLanguage: PropTypes.string.isRequired,
        merchantPosId: PropTypes.string.isRequired,
        payuBrand: PropTypes.oneOf(['true', 'false']),
        recurringPayment: PropTypes.oneOf(['true', 'false']),
        shopName: PropTypes.string.isRequired,
        storeCard: PropTypes.oneOf(['true', 'false']),
        totalAmount: PropTypes.string.isRequired,
        widgetMode: PropTypes.oneOf(['pay', 'use']),
        secondKeyMd5: PropTypes.string.isRequired,
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

export default withPayU;
