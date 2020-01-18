import {combineReducers} from 'redux';

const initialBuyerDeliveryIds = [
    'street',
    'postalCode',
    'city',
    'recipientName',
];

const initialBuyerDeliveryData = {
    street: {
        value: '',
        type: 'text',
        label: 'Ulica',
        validate: ['required'],
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
    recipientName: {
        value: '',
        type: 'text',
        label: 'Imię i nazwisko adresata',
        validate: ['required'],
    },
};

const buyerDeliveryIds = (state = initialBuyerDeliveryIds) => state;
const buyerDeliveryData = (state = initialBuyerDeliveryData) => state;

export const buyerDelivery = combineReducers({
    ids: buyerDeliveryIds,
    data: buyerDeliveryData,
});

const buyerInitialIds = [
    'email',
    'phone',
    'firstName',
    'lastName',
];

const buyerInitialData = {
    email: {
        value: '',
        type: 'text',
        label: 'Email kupującego',
        validate: ['required', 'email'],
    },
    phone: {
        value: '',
        type: 'tel',
        label: 'Telefon kupującego',
        validate: [],
    },
    firstName: {
        value: '',
        type: 'text',
        label: 'Imię kupującego',
        validate: [],
    },
    lastName: {
        value: '',
        type: 'text',
        label: 'Nazwisko kupującego',
        validate: [],
    },
};

const buyerIds = (state = buyerInitialIds) => state;
const buyerData = (state = buyerInitialData) => state;

export const buyer = combineReducers({
    ids: buyerIds,
    data: buyerData,
});
