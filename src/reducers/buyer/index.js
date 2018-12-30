const initialState = {
    ids: [
        'customerId',
        'extCustomerId',
        'email',
        'phone',
        'firstName',
        'lastName',
        'nin',
        'language',
    ],
    data: [
        {
            customerId: {
                value: 'guest',
                required: false,
                type: 'hidden',
                label: 'Id kupującego',
            },
            extCustomerId: {
                value: 'guest',
                required: false,
                type: 'hidden',
                label: 'Identyfikator kupującego używany w systemie klienta',
            },
            email: {
                value: '',
                required: true,
                type: 'email',
                label: 'Adres email kupującego',
            },
            phone: {
                value: '',
                required: false,
                type: 'tel',
                label: 'Numer telefonu',
            },
            firstName: {
                value: '',
                required: false,
                type: 'text',
                label: 'Imię kupującego',
            },
            lastName: {
                value: '',
                required: false,
                type: 'text',
                label: 'Nazwisko kupującego',
            },
            nin: {
                value: '',
                required: false,
                type: 'text',
                label: 'PESEL lub zagraniczny ekwiwalent',
            },
            language: {
                value: 'pl',
                required: false,
                type: 'hidden',
                label: '',
            },
        }
    ],
};

const buyer = (state = initialState, {type, payload}) => {
    switch (type) {
        default:
            return state;
    }
};

export default buyer;
