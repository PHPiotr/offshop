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
        required: true,
        type: 'text',
        label: 'Ulica',
    },
    postalBox: {
        value: '',
        required: false,
        type: 'text',
        label: 'Skrytka pocztowa',
    },
    postalCode: {
        value: '',
        required: true,
        type: 'text',
        label: 'Kod pocztowy',
    },
    city: {
        value: '',
        required: true,
        type: 'text',
        label: 'Miejscowość',
    },
    state: {
        value: '',
        required: false,
        type: 'text',
        label: 'Województwo',
    },
    countryCode: {
        value: 'pl',
        required: true,
        type: 'hidden',
        label: 'Kraj',
    },
    name: {
        value: '',
        required: false,
        type: 'text',
        label: 'Nazwa adresu',
    },
    recipientName: {
        value: '',
        required: true,
        type: 'text',
        label: 'Imię i nazwisko adresata',
    },
    recipientEmail: {
        value: '',
        required: false,
        type: 'email',
        label: 'Adres email adresata',
    },
    recipientPhone: {
        value: '',
        required: false,
        type: 'tel',
        label: 'Numer telefonu adresata',
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
