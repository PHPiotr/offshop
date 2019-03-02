import {HIDE_NOTIFICATION, SHOW_NOTIFICATION} from '../../actions/notification/types';

const initialState = {
    message: '',
    open: false,
    variant: 'info',
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SHOW_NOTIFICATION:
            return {...state, ...action.payload, open: true};

        case HIDE_NOTIFICATION:
            return {...state, open: false};

        default:
            return state;
    }
};
