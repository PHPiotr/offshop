import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import cart from '../reducers/cart';

const configureStore = (initialState) => {
    const middleware = [];

    if (process.env.NODE_ENV === 'development') {
        middleware.push(logger);
    }

    return createStore(
        combineReducers({
            cart,
        }),
        initialState,
        composeWithDevTools(applyMiddleware(...middleware))
    );
};

export const store = configureStore();

export default store;
