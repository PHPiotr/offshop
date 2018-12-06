const initialState = {
    items: [
        {
            'id': '1',
            'title': 'Odbiór osobisty',
            'price': 0,
        },
        {
            'id': '2',
            'title': 'Paczkomat',
            'price': 10,
        },
        {
            'id': '2',
            'title': 'Kurier (przedpłata)',
            'price': 12,
        },
    ],
};

const supply = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

export default supply;
