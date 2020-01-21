import {UPDATE_AUTH} from './actionTypes';

const initialState = {
    accessToken: null,
    idToken: null,
    expiresAt: 0,
};

export default (state = initialState, action) => {
    if (action.type === UPDATE_AUTH) {
        return {...action.payload};
    } else {
        return state;
    }
};
