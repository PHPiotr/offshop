import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';
import {ThemeProvider} from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import WebFont from 'webfontloader';
import './index.css';
import App from './App';
import configureStore from './store';
import AuthContext from './contexts/AuthContext';
import SocketContext from './contexts/SocketContext';
import getSocket from './services/socket';
import Auth from './services/auth';

WebFont.load({
    google: {
        families: [process.env.REACT_APP_LOGO_FONT]
    }
});

const theme = createMuiTheme({
    palette: {
        primary: {
            main: process.env.REACT_APP_MAIN_COLOR,
        },
    },
});

const socket = getSocket(process.env.REACT_APP_API_HOST);
const auth = new Auth(socket);

const store = configureStore(localStorage, process.env.NODE_ENV === 'development', module.hot);

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <SocketContext.Provider value={socket}>
                <AuthContext.Provider value={auth}>
                    <Router>
                        <App/>
                    </Router>
                </AuthContext.Provider>
            </SocketContext.Provider>
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
);
