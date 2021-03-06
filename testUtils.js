import React from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter, Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';
import {render} from '@testing-library/react';
import MockedSocket from 'socket.io-mock';
import SocketContext from './src/contexts/SocketContext';
import AuthContext from './src/contexts/AuthContext';
let socket = new MockedSocket();

global.socket = socket;

global.renderWithStore = (node, store) => render(
    <Provider store={store}>
        <SocketContext.Provider value={socket}>
            <BrowserRouter>{node}</BrowserRouter>
        </SocketContext.Provider>
    </Provider>
);

global.renderWithRouter = (
    ui,
    store,
    {
        route = '/',
        history = createMemoryHistory({ initialEntries: [route] }),
    } = {}
) => {
    const Wrapper = ({ children }) => (
        <Provider store={store}>
            <SocketContext.Provider value={socket}>
                <Router history={history}>{children}</Router>
            </SocketContext.Provider>
        </Provider>
    );
    return {...render(ui, { wrapper: Wrapper }), history};
};

global.renderWithAuth = (
    ui,
    store,
    auth,
    {
        route = '/',
        history = createMemoryHistory({ initialEntries: [route] }),
    } = {}
) => {
    const Wrapper = ({ children }) => (
        <Provider store={store}>
            <SocketContext.Provider value={socket}>
                <AuthContext.Provider value={auth}>
                    <Router history={history}>{children}</Router>
                </AuthContext.Provider>
            </SocketContext.Provider>
        </Provider>
    );
    return {...render(ui, { wrapper: Wrapper }), history};
};

global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost:3000/foo');
global.URL.revokeObjectURL = jest.fn();
