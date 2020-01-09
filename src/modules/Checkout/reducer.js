import {combineReducers} from "redux";
import * as actions from './actionTypes';
import {SET_CURRENT_DELIVERY_METHOD} from '../../modules/Delivery/actionTypes';

const stepsIdsWithBuyerDeliveryRequired = [0, 1, 2];
const stepsIdsWithBuyerDeliverySkipped = [0, 2];

const initialState = {
    activeStepId: 0,
    stepsIds: [],
};

export const checkout = (state = initialState, action) => {
    switch (action.type) {
        case actions.STEP_NEXT:
            return {
                ...state,
                activeStepId: state.activeStep === state.stepsIds[state.stepsIds.length - 1]
                    ? state.activeStep
                    : state.stepsIds[state.stepsIds.indexOf(state.activeStepId) + 1],
            };
        case actions.STEP_BACK:
            return {
                ...state,
                activeStepId: state.activeStep === state.stepsIds[0]
                    ? state.activeStep
                    : state.stepsIds[state.stepsIds.indexOf(state.activeStepId) - 1],
            };
        case actions.SET_ACTIVE_STEP_ID:
            return {
                ...state,
                activeStepId: action.payload.activeStepId,
            };
        case SET_CURRENT_DELIVERY_METHOD:
            let withDelivery = action.payload.current.unitPrice > 0;
            return {
                ...state,
                stepsIds: withDelivery ? stepsIdsWithBuyerDeliveryRequired : stepsIdsWithBuyerDeliverySkipped,
                activeStepId: withDelivery ? (state.activeStepId === 2 ? 1 : state.activeStepId) : (state.activeStepId === 1 ? 2 : state.activeStepId),
            };
        default:
            return state;
    }
};

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
    } else {
        return state;
    }
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
    } else {
        return state;
    }
};

export const buyer = combineReducers({
    ids: buyerIds,
    data: buyerData,
});
