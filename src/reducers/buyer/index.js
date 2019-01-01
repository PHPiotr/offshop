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
        required: false,
        type: 'hidden',
        label: 'Id kupującego',
    },
    extCustomerId: {
        value: '',
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
