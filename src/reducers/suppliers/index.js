import { SET_CURRENT_SUPPLIER } from '../../actions/suppliers';
import {combineReducers} from "redux";

const initialIds = ['1','2'];

const initialData = {
    '1': {
        id: '1',
        title: 'Odbiór osobisty',
        pricePerUnit: 0,
    },
    '2': {
        id: '2',
        title: 'Kurier (przedpłata)',
        pricePerUnit: 12,
    },
};

const initialCurrentId = '1';

const initialState = {
    currentId: null,
    current: {},
    items: [
        {
            id: '1',
            title: 'Odbiór osobisty',
            pricePerUnit: 0,
        },
        {
            id: '2',
            title: 'Kurier (przedpłata)',
            pricePerUnit: 12,
        },
    ],
};

const ids = (state = initialIds, {type}) => {
    switch (type) {
        default:
            return state;
    }
};

const data = (state = initialData, {type}) => {
    switch (type) {
        default:
            return state;
    }
};

const currentId = (state = initialCurrentId, {type, payload}) => {
    switch (type) {
        case SET_CURRENT_SUPPLIER:
            return payload.currentId;
        default:
            return state;
    }
};

const suppliers = combineReducers({
    ids,
    data,
    currentId,
});

export default suppliers;
