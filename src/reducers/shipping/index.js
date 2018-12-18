import {SET_SHIPPING_INPUT_VALUE} from "../../actions/shipping";

const initialState = {
    itemIds: [
        'firstName',
        'lastName',
        'phone',
        'email',
        'address',
        'city',
        'state',
        'zip',
    ],
    items: {
        firstName: {
            value: '',
            required: true,
            label: 'Imię',
            type: 'text',
        },
        lastName: {
            value: '',
            required: true,
            label: 'Nazwisko',
            type: 'text',
        },
        phone: {
            value: '',
            required: true,
            label: 'Telefon',
            type: 'tel',
        },
        email: {
            value: '',
            required: true,
            label: 'Email',
            type: 'email',
        },
        address: {
            value: '',
            required: true,
            label: 'Adres',
            type: 'text',
        },
        city: {
            value: '',
            required: true,
            label: 'Miasto',
            type: 'text',
        },
        state: {
            value: '',
            required: true,
            label: 'Województwo',
            type: 'text',
        },
        zip: {
            value: '',
            required: true,
            label: 'Kod pocztowy',
            type: 'text',
        },
    },
};

const shipping = (state = initialState, action) => {
    switch (action.type) {
        case SET_SHIPPING_INPUT_VALUE:
            return {
                ...state,
                items: {
                    ...state.items,
                    [action.payload.name]: {
                        ...state.items[action.payload.name],
                        value: action.payload.value,
                    },
                },
            };
        default:
            return state;
    }
};

export default shipping;
