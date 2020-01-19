import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';
import {ThemeProvider} from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import WebFont from 'webfontloader';
import './index.css';
import App from './App';
import store from './store';
import SocketContext from './SocketContext';
import io from './io';

const socket = io();

WebFont.load({
    google: {
        families: [process.env.REACT_APP_LOGO_FONT || 'Roboto']
    }
});

const theme = createMuiTheme({
    palette: {
        primary: {
            main: process.env.REACT_APP_MAIN_COLOR || '#3f51b5',
        },
    },
});

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <SocketContext.Provider value={socket}>
                <Router>
                    <App/>
                </Router>
            </SocketContext.Provider>
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
);
