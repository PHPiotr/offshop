import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {Helmet} from "react-helmet";

const withPayU = (WrappedComponent) => {

    class PayU extends Component {

        state = {
            payUButton: null,
        };

        render() {

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
                        <script
                            src="https://secure.payu.com/front/widget/js/payu-bootstrap.js"
                            pay-button="#pay-button"
                            merchant-pos-id="145227"
                            shop-name="Nazwa sklepu"
                            total-amount="9.99"
                            currency-code="PLN"
                            customer-language="pl"
                            store-card="true"
                            customer-email="email@exampledomain.com"
                            sig="250f5f53e465777b6fefb04f171a21b598ccceb2899fc9f229604ad529c69532">
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
