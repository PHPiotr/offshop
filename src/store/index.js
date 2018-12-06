import { createStore, applyMiddleware } from "redux";
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../reducers';

const configureStore = (initialState) => {
    const middleware = [];

    if (process.env.NODE_ENV === 'development') {
        middleware.push(logger);
    }

    return createStore(
        rootReducer,
        initialState,
        composeWithDevTools(applyMiddleware(...middleware))
    );
};

export const store = configureStore();

export default store;
