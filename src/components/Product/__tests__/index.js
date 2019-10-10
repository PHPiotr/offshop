import '@testing-library/react/cleanup-after-each';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';
import {render, fireEvent, cleanup} from '@testing-library/react';
import rootReducer from '../../../reducers';
import ProductView from '../index';

afterEach(cleanup);

function renderWithProviders(
    ui,
    {initialState, store = createStore(rootReducer, initialState, applyMiddleware(thunk))} = {}
) {
    return {
        ...render(
            <Provider store={store}>
                <Router>{ui}</Router>
            </Provider>
        ),
        store,
    }
}

it('shows dialog after product is added to cart', () => {
    const {queryByRole, getByRole} = renderWithProviders(<ProductView />);
    expect(queryByRole('dialog')).toBeNull();
    fireEvent.click(getByRole("addToCart"));
    expect(getByRole('dialog')).toBeInTheDocument();
});
