export const getProducts = ({sort, order, limit, skip} = {}) =>
    fetch(`${process.env.REACT_APP_API_HOST}/products?sort=${sort}&order=${order}&limit=${limit}&skip=${skip}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
