import {OPEN_DIALOG, CLOSE_DIALOG} from '../actions/dialog';

const initialState = {
    open: false,
    itemAdded: {},
};

export default (state = initialState, action) => {
    switch (action.type) {
        case OPEN_DIALOG:
            return { ...state, open: true };
        case CLOSE_DIALOG:
            return { ...state, open: false, itemAdded: {} };
        default:
            return state;
    }
};
