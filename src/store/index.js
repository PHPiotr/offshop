import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../reducers';
import {loadState, saveState} from "../services/localStorage";
import throttle from 'lodash.throttle';
import {initialState as orderInitialState} from '../reducers/order';

const devEnv = process.env.NODE_ENV === 'development';

const configureStore = initialState => {
    const middleware = [thunk];

    if (devEnv) {
        middleware.push(logger);
    }

    const createdStore = createStore(
        rootReducer,
        initialState,
        composeWithDevTools(applyMiddleware(...middleware))
    );

    createdStore.subscribe(throttle(() => {
        const state = store.getState();
        saveState({
            cart: state.cart,
            order: {...orderInitialState, data: state.order.data, error: state.order.error},
            products: {...state.products},
            deliveryMethods: {...state.deliveryMethods},
            form: {...state.form},
        });
    }, 1000));

    if (devEnv) {
        if (module.hot) {
            module.hot.accept('../reducers', () =>
                createdStore.replaceReducer(require('../reducers').default)
            );
        }
    }

    return createdStore;
};


export const store = configureStore(loadState());

export default store;
