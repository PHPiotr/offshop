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
