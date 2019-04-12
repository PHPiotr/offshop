import React, {Component} from 'react';
import PropTypes from 'prop-types';

const successCallback = (data) => {
    debugger;
};

const withPayU = (WrappedComponent) => {

    class PayU extends Component {

        state = {
            payUButton: null,
        };

        setupPayU = () => {
            const openPayuScript = document.createElement('script');
            openPayuScript.src = 'https://secure.payu.com/res/v2/openpayu-2.1.js';
            openPayuScript.type = 'text/javascript';
            openPayuScript.async = true;
            document.body.appendChild(openPayuScript);
            openPayuScript.onload = function() {
                const OpenPayU = window.OpenPayU;
                const pluginTokenScript = document.createElement('script');
                pluginTokenScript.src = 'https://secure.payu.com/res/v2/plugin-token-2.1.js';
                pluginTokenScript.type = 'text/javascript';
                pluginTokenScript.async = true;
                document.body.appendChild(pluginTokenScript);
            };
        };

        setupPayUNotWorking = () => {
            const {totalPrice, buyer, sig} = this.props;
            const script = document.createElement('script');
            script.src = 'https://secure.snd.payu.com/front/widget/js/payu-bootstrap.js';
            script.type = 'text/javascript';

            script['pay-button'] = "#pay-button";
            script['currency-code'] = process.env.REACT_APP_CURRENCY_CODE;
            script['customer-email'] = buyer.email;
            script['customer-language'] = 'pl';
            script['merchant-pos-id'] = process.env.REACT_APP_POS_ID;
            script['payu-brand'] = true;
            script['recurring-payment'] = false;
            script['shop-name'] = process.env.REACT_APP_MERCHANT_NAME;
            script['store-card'] = false;
            script['total-amount'] = totalPrice;
            script['widget-mode'] = 'pay';
            script['sig'] = sig;
            script['success-callback'] = successCallback

            document.body.appendChild(script);
        };

        componentDidMount() {
            this.setupPayU();
        }

        render() {
            return (
                <WrappedComponent {...this.props}/>
            );
        }
    }

    PayU.propTypes = {
        totalPrice: PropTypes.number.isRequired,
    };

    return PayU;
};

export default withPayU;
