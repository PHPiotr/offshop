import {SET_APP_BAR_TITLE} from '../../actions/appBar';

const initialState = {
    title: 'Offshop',
};

const appBar = (state = initialState, action) => {
    switch(action) {
        case SET_APP_BAR_TITLE:
            return {
                ...state,
                title: action.title,
            };
        default:
            return state;
    }
};

export default appBar;
