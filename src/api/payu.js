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

export const orderCreateRequest = ({
                                accessToken,
                                authorizationCode,
                                totalAmount,
                                products,
                                description,
                                buyer,
                            }) =>
    fetch(`${process.env.REACT_APP_API_HOST}/orders`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        body: JSON.stringify({
            accessToken,
            authorizationCode,
            totalAmount,
            products,
            description,
            merchantPosId: process.env.REACT_APP_GOOGLE_PAY_TOKENIZATION_GATEWAY_MERCHANT_ID,
            currencyCode: process.env.REACT_APP_CURRENCY_CODE,
            notifyUrl: 'https://localhost:3000/cart',
            buyer,
            settings: {
                invoiceDisabled: true,
            },
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

export const orderRetrieveRequest = ({accessToken, extOrderId}) =>
    fetch(`${process.env.REACT_APP_API_HOST}/orders/${extOrderId}`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });
