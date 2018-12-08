import {SET_CURRENT_SUPPLIER} from "../../actions/suppliers";

const initialState = {
    currentId: '1',
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
