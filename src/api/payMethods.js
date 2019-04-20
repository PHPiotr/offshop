import axios from 'axios';

export const getPayMethods = () => {
    let url = `${process.env.REACT_APP_API_HOST}/pay-methods`;
    return axios(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
