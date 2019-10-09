import {combineReducers} from "redux";
import {SET_BUYER_DELIVERY_INPUT_VALUE} from "../../actions/buyerDelivery";

const initialIds = [
    'street',
    'postalCode',
    'city',
    'recipientName',
];

const initialData = {
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
