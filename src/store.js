import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import throttle from 'lodash.throttle';
import rootReducer from './reducers';

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (e) {
        console.error(e);
        return undefined;
    }
};

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch (e) {
        console.error(e);
    }
};

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
            auth: state.auth,
            products: state.products,
            cart: state.cart,
            checkout: state.checkout,
            order: state.order,
            deliveryMethods: {...state.deliveryMethods},
            form: {...state.form},
        });
    }, 400));

    if (devEnv) {
        if (module.hot) {
            module.hot.accept('./reducers', () =>
                createdStore.replaceReducer(require('./reducers').default)
            );
        }
    }

    return createdStore;
};


export const store = configureStore(loadState());

export default store;
