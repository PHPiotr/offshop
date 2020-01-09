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
