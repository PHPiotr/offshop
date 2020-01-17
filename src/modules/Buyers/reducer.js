import * as actions from '../Checkout/actionTypes';
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

const buyerDeliveryIds = (state = initialBuyerDeliveryIds, {type}) => {
    return state;
};

const buyerDeliveryData = (state = initialBuyerDeliveryData, {type, payload}) => {
    if (type === actions.SET_BUYER_DELIVERY_INPUT_VALUE) {
        return {
            ...state,
            [payload.name]: {
                ...state[payload.name],
                value: payload.value,
            },
        };
    }
    return state;
};

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

const buyerIds = (state = buyerInitialIds, {type}) => {
    return state;
};

const buyerData = (state = buyerInitialData, {type, payload}) => {
    if (type === actions.SET_BUYER_INPUT_VALUE) {
        return {
            ...state,
            [payload.name]: {
                ...state[payload.name],
                value: payload.value,
            },
        };
    }
    return state;
};

export const buyer = combineReducers({
    ids: buyerIds,
    data: buyerData,
});
