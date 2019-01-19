import {combineReducers} from "redux";
import {SET_BUYER_DELIVERY_INPUT_VALUE} from "../../actions/buyerDelivery";

const initialIds = [
    'street',
    'postalBox',
    'postalCode',
    'city',
    'state',
    'countryCode',
    'name',
    'recipientName',
    'recipientEmail',
    'recipientPhone',
];

const initialData = {
    street: {
        value: '',
        type: 'text',
        label: 'Ulica',
        validate: ['required'],
    },
    postalBox: {
        value: '',
        type: 'text',
        label: 'Skrytka pocztowa',
        validate: [],
    },
    postalCode: {
        value: '',
        type: 'text',
        label: 'Kod pocztowy',
        validate: ['required'],
    },
    city: {
        value: '',
        type: 'text',
        label: 'Miejscowość',
        validate: ['required'],
    },
    state: {
        value: '',
        type: 'text',
        label: 'Województwo',
        validate: [],
    },
    countryCode: {
        value: 'pl',
        type: 'hidden',
        label: 'Kraj',
        validate: ['required'],
    },
    name: {
        value: '',
        type: 'text',
        label: 'Nazwa adresu',
        validate: [],
    },
    recipientName: {
        value: '',
        type: 'text',
        label: 'Imię i nazwisko adresata',
        validate: ['required'],
    },
    recipientEmail: {
        value: '',
        required: false,
        type: 'email',
        label: 'Email adresata',
        validate: ['email'],
    },
    recipientPhone: {
        value: '',
        type: 'tel',
        label: 'Numer telefonu adresata',
        validate: [],
    },
};

const ids = (state = initialIds, {type}) => {
    switch (type) {
        default:
            return state;
    }
};

const data = (state = initialData, {type, payload}) => {
    switch (type) {
        case SET_BUYER_DELIVERY_INPUT_VALUE:
            return {
                ...state,
                [payload.name]: {
                    ...state[payload.name],
                    value: payload.value,
                },
            };
        default:
            return state;
    }
};

const buyerDelivery = combineReducers({ids, data});

export default buyerDelivery;
