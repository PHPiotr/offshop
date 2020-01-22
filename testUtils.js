import React from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {render} from '@testing-library/react';
import io from './src/services/socket';
import MockedSocket from 'socket.io-mock';
import SocketContext from './src/contexts/SocketContext';
let socket = new MockedSocket();
jest.mock('./src/services/socket');
io.mockResolvedValue(socket);

global.socket = socket;

global.renderWithStore = (node, store) => render(
    <Provider store={store}>
        <SocketContext.Provider value={socket}>
            <BrowserRouter>{node}</BrowserRouter>
        </SocketContext.Provider>
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
