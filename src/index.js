import React from 'react';
import Auth0 from 'auth0-js';
import io from 'socket.io-client';
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
import Auth from './services/auth';

const auth0 = new Auth0.WebAuth({
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
    redirectUri: `${process.env.REACT_APP_URL}/callback`,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    responseType: 'token id_token',
    scope: 'openid',
});

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

const socket = io(process.env.REACT_APP_API_HOST);
const auth = new Auth(auth0);

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
