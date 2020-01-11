import axios from 'axios';

export const getPayMethods = (accessToken) => {
    let url = `${process.env.REACT_APP_API_HOST}/pay-methods`;
    return axios(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });
};

export const orderCreateRequest = params =>
    axios(`${process.env.REACT_APP_API_HOST}/orders`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        data: {
            payMethods: params.payMethods,
            totalAmount: params.totalAmount,
            totalWithoutDelivery: params.totalWithoutDelivery,
            totalWeight: params.totalWeight,
            productsById: params.productsById,
            productsIds: params.productsIds,
            description: params.description,
            merchantPosId: process.env.REACT_APP_GOOGLE_PAY_TOKENIZATION_GATEWAY_MERCHANT_ID,
            currencyCode: process.env.REACT_APP_CURRENCY_CODE,
            notifyUrl: `${process.env.REACT_APP_API_HOST}${process.env.REACT_APP_PAYU_NOTIFY_PATH}`,
            buyer: params.buyer,
            deliveryMethod: params.deliveryMethod,
            settings: {
                invoiceDisabled: true,
            },
            continueUrl: process.env.REACT_APP_PAYU_CONTINUE_URL,
        },
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${params.accessToken}`,
        },
    });
