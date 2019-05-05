import {UPDATE_AUTH} from '../../actions/auth';

const initialState = {
    accessToken: null,
    idToken: null,
    expiresAt: 0,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_AUTH:
            return {...action.payload};
        default:
            return state;
    }
};
