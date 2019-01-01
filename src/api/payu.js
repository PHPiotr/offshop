export const authorize = () =>
    fetch(`${process.env.REACT_APP_API_HOST}/authorize`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        body: JSON.stringify({
            client_id: process.env.REACT_APP_PAYU_CLIENT_ID,
            client_secret: process.env.REACT_APP_PAYU_CLIENT_SECRET,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

export const orderCreateRequest = params =>
    fetch(`${process.env.REACT_APP_API_HOST}/orders`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        body: JSON.stringify({
            payMethods: {
                payMethod: {
                    value: process.env.REACT_APP_PAYU_METHOD_VALUE_GOOGLE_PAY,
                    type: process.env.REACT_APP_PAYU_METHOD_TYPE_GOOGLE_PAY,
                    authorizationCode: params.authorizationCode,
                }
            },
            totalAmount: params.totalAmount,
            products: params.products,
            description: params.description,
            merchantPosId: process.env.REACT_APP_GOOGLE_PAY_TOKENIZATION_GATEWAY_MERCHANT_ID,
            currencyCode: process.env.REACT_APP_CURRENCY_CODE,
            notifyUrl: 'https://localhost:3000',
            buyer: params.buyer,
            buyerDelivery: params.buyerDelivery,
            settings: {
                invoiceDisabled: true,
            },
            continueUrl: `https://localhost:3000/order`,
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${params.accessToken}`,
        },
    });

export const orderRetrieveRequest = params =>
    fetch(`${process.env.REACT_APP_API_HOST}/orders/${params.extOrderId}`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${params.accessToken}`,
        },
    });
