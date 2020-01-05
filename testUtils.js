import React from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {render} from '@testing-library/react';

global.renderWithStore = (node, store) => render(
    <Provider store={store}>
        <BrowserRouter>{node}</BrowserRouter>
    </Provider>
);

global.fakeLocalStorage = () => {
    Object.defineProperty(window, "localStorage", {
        value: {
            getItem: jest.fn(() => null),
            setItem: jest.fn(() => null),
        },
        writable: true,
    });
};
