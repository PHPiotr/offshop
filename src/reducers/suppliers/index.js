import {SET_CURRENT_SUPPLIER} from "../../actions/suppliers";

const initialState = {
    currentId: '3',
    items: [
        {
            id: '1',
            title: 'Odbiór osobisty',
            price: 0,
        },
        {
            id: '2',
            title: 'Paczkomat',
            price: 10,
        },
        {
            id: '3',
            title: 'Kurier (przedpłata)',
            price: 12,
        },
    ],
};

const suppliers = (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_SUPPLIER:
            return {
                ...state,
                currentId: action.payload.supplierId,
            };
        default:
            return state;
    }
};

export default suppliers;
