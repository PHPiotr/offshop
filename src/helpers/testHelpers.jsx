import React from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {render} from '@testing-library/react';

export const renderWithStore = (node, store) => render(
    <Provider store={store}>
        <BrowserRouter>{node}</BrowserRouter>
    </Provider>
);
