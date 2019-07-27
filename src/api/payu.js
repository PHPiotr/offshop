import axios from 'axios';

export const authorize = () =>
    axios(`${process.env.REACT_APP_API_HOST}/authorize`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        data: {
            client_id: process.env.REACT_APP_PAYU_CLIENT_ID,
            client_secret: process.env.REACT_APP_PAYU_CLIENT_SECRET,
        },
        headers: {
            'Content-Type': 'application/json',
        },
    });

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

export const orderRetrieveRequest = params =>
    axios(`${process.env.REACT_APP_API_HOST}/orders/${params.extOrderId}`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${params.accessToken}`,
        },
    });
