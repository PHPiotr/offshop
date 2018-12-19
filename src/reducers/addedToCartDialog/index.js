import {
    OPEN_ADDED_TO_CART_DIALOG,
    CLOSE_ADDED_TO_CART_DIALOG,
} from '../../actions/addedToCartDialog';

const initialState = {
    open: false,
    itemAdded: {},
};

const addedToCartDialog = (state = initialState, action) => {
    switch (action.type) {
        case OPEN_ADDED_TO_CART_DIALOG:
            return { ...state, open: true };
        case CLOSE_ADDED_TO_CART_DIALOG:
            return { ...state, open: false, itemAdded: {} };
        default:
            return state;
    }
};

export default addedToCartDialog;
