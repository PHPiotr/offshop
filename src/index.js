import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';
import {addLocaleData, IntlProvider} from 'react-intl';
import en from 'react-intl/locale-data/en';
import pl from 'react-intl/locale-data/pl';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './store';
import messages from './messages';
import {flattenMessages} from './utils';

addLocaleData([...en, ...pl]);

let locale = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage || 'en-US';

ReactDOM.render(
    <IntlProvider locale={locale} messages={flattenMessages(messages[locale])}>
        <Provider store={store}>
            <Router>
                <App/>
            </Router>
        </Provider>
    </IntlProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
