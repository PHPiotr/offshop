import React, {useContext} from 'react';

const payment = {
    src: `${process.env.REACT_APP_PAYU_BASE_URL}/front/widget/js/payu-bootstrap.js`,
    currencyCode: process.env.REACT_APP_CURRENCY_CODE,
    customerLanguage: 'pl',
    merchantPosId: process.env.REACT_APP_POS_ID,
    shopName: process.env.REACT_APP_MERCHANT_NAME,
    secondKeyMd5: process.env.REACT_APP_SECOND_KEY,
    payuBrand: process.env.REACT_APP_PAYU_BRAND,
    payButton: process.env.REACT_APP_PAYU_PAY_BUTTON,
    recurringPayment: process.env.REACT_APP_PAYU_RECURRING_PAYMENT,
    storeCard: process.env.REACT_APP_PAYU_STORE_CARD,
    widgetMode: process.env.REACT_APP_PAYU_WIDGET_MODE,

    googlePayScriptId: process.env.REACT_APP_GOOGLE_PAY_SCRIPT_ID,
    googlePayButtonParentId: process.env.REACT_APP_GOOGLE_PAY_BUTTON_PARENT_ID,
    googlePayScriptSrc: process.env.REACT_APP_GOOGLE_PAY_SCRIPT_SRC,
    environment: process.env.REACT_APP_GOOGLE_PAY_ENV,
    apiVersion: parseInt(process.env.REACT_APP_GOOGLE_PAY_API_VERSION, 10),
    apiVersionMinor: parseInt(process.env.REACT_APP_GOOGLE_PAY_API_VERSION_MINOR, 10),
    baseCardPaymentMethodType: process.env.REACT_APP_GOOGLE_PAY_BASE_CARD_PAYMENT_METHOD_TYPE,
    baseCardPaymentMethodAllowedAuthMethods: `${process.env.REACT_APP_GOOGLE_PAY_ALLOWED_CARD_AUTH_METHODS}`.split(','),
    baseCardPaymentMethodAllowedCardNetworks: `${process.env.REACT_APP_GOOGLE_PAY_ALLOWED_CARD_NETWORKS}`.split(','),
    tokenizationSpecificationType: process.env.REACT_APP_GOOGLE_PAY_TOKENIZATION_TYPE,
    tokenizationSpecificationGateway: process.env.REACT_APP_GOOGLE_PAY_TOKENIZATION_GATEWAY,
    tokenizationSpecificationGatewayMerchantId: process.env.REACT_APP_GOOGLE_PAY_TOKENIZATION_GATEWAY_MERCHANT_ID,
    merchantName: process.env.REACT_APP_MERCHANT_NAME,
    totalPriceStatus: process.env.REACT_APP_TOTAL_PRICE_STATUS,
    googlePayMethodValue: process.env.REACT_APP_PAYU_METHOD_VALUE_GOOGLE_PAY,
    googlePayMethodType: process.env.REACT_APP_PAYU_METHOD_TYPE_GOOGLE_PAY,
};

const PaymentContext = React.createContext(payment);

export const usePayment = () => useContext(PaymentContext);

export default PaymentContext;