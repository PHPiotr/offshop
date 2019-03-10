import {LOGGED_IN_SUCCESS} from '../../actions/auth';

const initialState = {
    accessToken: '',
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LOGGED_IN_SUCCESS:
            return {...state, accessToken: action.payload.accessToken};
        default:
            return state;
    }
};
