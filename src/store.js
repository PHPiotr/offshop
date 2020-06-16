import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import throttle from 'lodash.throttle';
import rootReducer from './reducers';

const loadState = (storage, isDevEnv) => {
    try {
        const serializedState = storage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (e) {
        if (isDevEnv) {
            console.error(e);
        }
        return undefined;
    }
};

const saveState = (state, storage, isDevEnv) => {
    try {
        const serializedState = JSON.stringify(state);
        storage.setItem('state', serializedState);
    } catch (e) {
        if (isDevEnv) {
            console.error(e);
        }
    }
};

const configureStore = (storage, isDevEnv, hotModule) => {
    const initialState = loadState(storage, isDevEnv);
    const middleware = [thunk];

    if (isDevEnv) {
        middleware.push(logger);
    }

    const createdStore = createStore(
        rootReducer,
        initialState,
        composeWithDevTools(applyMiddleware(...middleware))
    );

    createdStore.subscribe(throttle(() => {
        const state = createdStore.getState();
        saveState({
            auth: state.auth,
            products: {...state.products, isFetching: undefined},
            cart: state.cart,
            checkout: state.checkout,
            order: state.order,
            deliveryMethods: {...state.deliveryMethods},
            form: {...state.form},
        }, storage, isDevEnv);
    }, 400));

    if (isDevEnv && hotModule) {
        hotModule.accept('./reducers', () =>
            createdStore.replaceReducer(require('./reducers').default)
        );
    }

    return createdStore;
};

export default configureStore;
