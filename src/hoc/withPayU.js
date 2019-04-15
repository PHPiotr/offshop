import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {Helmet} from "react-helmet";
import sha256 from 'crypto-js/sha256';

const withPayU = (WrappedComponent) => {

    class PayU extends Component {

        state = {
            payUButton: null,
        };

        render() {
debugger;
            const x = 12345;
            return (
                <Fragment>
                    <Helmet>
                        <script type="text/javascript">
                            {`
                                function test(data) {
                                    console.log("callback");
                                    console.log(data);
                                }
                            `}
                        </script>
                        {/*<script*/}
                        {/*    src="https://secure.payu.com/front/widget/js/payu-bootstrap.js"*/}
                        {/*    currency-code={process.env.REACT_APP_CURRENCY_CODE}*/}
                        {/*    customer-email="email@exampledomain.com"*/}
                        {/*    customer-language="pl"*/}
                        {/*    merchant-pos-id="145227"*/}
                        {/*    pay-button="#pay-button"*/}
                        {/*    shop-name="Nazwa sklepu"*/}
                        {/*    store-card="true"*/}
                        {/*    total-amount="9.99"*/}
                        {/*    sig="250f5f53e465777b6fefb04f171a21b598ccceb2899fc9f229604ad529c69532">*/}
                        {/*</script>*/}
                        <script
                            pay-button="#pay-button"
                            sig={this.props.sig.toString()}
                            src="https://secure.payu.com/front/widget/js/payu-bootstrap.js"
                            currency-code={process.env.REACT_APP_CURRENCY_CODE}
                            customer-email="email@exampledomain.com"
                            customer-language="pl"
                            merchant-pos-id={process.env.REACT_APP_POS_ID}
                            payu-brand="true"
                            recurring-payment="false"
                            shop-name="Offshop"
                            store-card="false"
                            total-amount="9.99"
                        >
                        </script>
                    </Helmet>
                    <WrappedComponent {...this.props}/>
                </Fragment>
            );
        }
    }

    PayU.propTypes = {
        totalPrice: PropTypes.number.isRequired,
    };

    return PayU;
};

export default withPayU;
