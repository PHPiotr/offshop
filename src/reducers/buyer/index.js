import {combineReducers} from "redux";
import {SET_BUYER_INPUT_VALUE} from "../../actions/buyer";

const initialIds = [
    'customerId',
    'extCustomerId',
    'email',
    'phone',
    'firstName',
    'lastName',
    'nin',
    'language',
];

const initialData = {
    customerId: {
        value: '',
        type: 'hidden',
        label: 'Id kupującego',
        validate: [],
    },
    extCustomerId: {
        value: '',
        type: 'hidden',
        label: 'Identyfikator kupującego używany w systemie klienta',
        validate: [],
    },
    email: {
        value: '',
        type: 'text',
        label: 'Adres email kupującego',
        validate: ['required', 'email'],
    },
    phone: {
        value: '',
        type: 'tel',
        label: 'Numer telefonu',
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
    nin: {
        value: '',
        type: 'text',
        label: 'PESEL lub zagraniczny ekwiwalent',
        validate: [],
    },
    language: {
        value: 'pl',
        type: 'hidden',
        label: '',
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
        case SET_BUYER_INPUT_VALUE:
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

const buyer = combineReducers({ids, data});

export default buyer;
