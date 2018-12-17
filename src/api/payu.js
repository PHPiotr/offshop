export const authorize = () => fetch('https://localhost:9000/authorize', {
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

export const createOrder = (
    accessToken,
    authorizationCode,
    totalAmount,
    products,
    description
) => fetch('https://localhost:9000/google_pay/orders', {
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
        customerIp: "127.0.0.1",
        notifyUrl: "https://localhost:3000/notify",
        buyer: {
            email: "john.doe@example.com",
            phone: "654111654",
            firstName: "John",
            lastName: "Doe",
            language: "pl",
        },
        settings: {
            invoiceDisabled: true,
        },
    }),
    headers: {
        'Content-Type': 'application/json',
    }
});
