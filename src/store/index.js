import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../reducers';

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

    if (devEnv) {
        if (module.hot) {
            module.hot.accept('../reducers', () =>
                createdStore.replaceReducer(require('../reducers').default)
            );
        }
    }

    return createdStore;
};

export const store = configureStore();

export default store;
