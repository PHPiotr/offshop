import {combineReducers} from "redux";
import {SET_BUYER_INPUT_VALUE} from "../../actions/buyer";

const initialIds = [
    'email',
    'phone',
    'firstName',
    'lastName',
];

const initialData = {
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
