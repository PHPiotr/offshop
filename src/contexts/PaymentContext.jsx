import React, {useContext} from 'react';

const payment = {
    src: `${process.env.REACT_APP_PAYU_BASE_URL}/front/widget/js/payu-bootstrap.js`,
    currencyCode: process.env.REACT_APP_CURRENCY_CODE,
    customerLanguage: 'pl',
    merchantPosId: process.env.REACT_APP_MERCHANT_POS_ID,
    shopName: process.env.REACT_APP_MERCHANT_NAME,
    secondKeyMd5: process.env.REACT_APP_SECOND_KEY,
    payuBrand: 'true',
    payButton: '#pay-button',
    recurringPayment: 'false',
    storeCard: 'false',
    widgetMode: 'pay',

    googlePayScriptId: 'google-pay-script',
    googlePayButtonParentId: 'google-pay-btn-wrapper',
    googlePayScriptSrc: 'https://pay.google.com/gp/p/js/pay.js',
    environment: process.env.REACT_APP_GOOGLE_PAY_ENV,
    apiVersion: parseInt(process.env.REACT_APP_GOOGLE_PAY_API_VERSION, 10),
    apiVersionMinor: parseInt(process.env.REACT_APP_GOOGLE_PAY_API_VERSION_MINOR, 10),
    baseCardPaymentMethodType: 'CARD',
    baseCardPaymentMethodAllowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
    baseCardPaymentMethodAllowedCardNetworks: ['MASTERCARD', 'VISA'],
    tokenizationSpecificationType: 'PAYMENT_GATEWAY',
    tokenizationSpecificationGateway: 'payu',
    tokenizationSpecificationGatewayMerchantId: process.env.REACT_APP_MERCHANT_POS_ID,
    merchantName: process.env.REACT_APP_MERCHANT_NAME,
    totalPriceStatus: 'FINAL',
    googlePayMethodValue: 'ap',
    googlePayMethodType: 'PBL',
};

const PaymentContext = React.createContext(payment);

export const usePayment = () => useContext(PaymentContext);

export default PaymentContext;
