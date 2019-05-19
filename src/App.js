import React, { Component, Fragment } from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import Navigation from './containers/Navigation';
import Products from './containers/Products';
import Product from './containers/Product';
import Cart from './containers/Cart';
import Checkout from './containers/Checkout';
import Order from './containers/Order';
import AdminProductForm from './components/Admin/ProductForm';
import AdminProducts from './components/Admin/ProductsList';
import AdminDeliveryMethodForm from './components/Admin/DeliveryMethodForm';
import AdminDeliveryMethods from './components/Admin/DeliveryMethodsList';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import { hot } from 'react-hot-loader';
import Notification from './containers/Notification';
import Auth from './services/auth';
import store from './store';
import {updateAuth} from './actions/auth';

const auth = new Auth();
const {isAuthenticated, renewSession} = auth;
const LOGGED_IN = 'LOGGED_IN';

const PrivateRoute = ({component: Component, ...rest}) => {

    try {
        if (localStorage.getItem(LOGGED_IN) === 'true') {
            const authState = store.getState().auth;
            auth.accessToken = authState.accessToken;
            auth.idToken = authState.idToken;
            auth.expiresAt = authState.expiresAt;
            renewSession();
        }
    } catch (error) {
        console.error(error);
    }

    return (
        <Route
            {...rest}
            render={props => {
                return isAuthenticated() ? (
                    <Component {...props}/>
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: {from: rest.location}
                        }}
                    />
                )
            }}
        />
    );
};

const handleAuthentication = async ({history, location}) => {
    if (/access_token|id_token|error/.test(location.hash)) {
        try {
            await auth.handleAuthentication();
            localStorage.setItem(LOGGED_IN, 'true');
            store.dispatch(updateAuth({
                accessToken: auth.getAccessToken(),
                idToken: auth.getIdToken(),
                expiresAt: auth.getExpiresAt(),
            }));
            history.replace('/admin/products/list');
        } catch (error) {
            auth.logout();
            store.dispatch(updateAuth({
                accessToken: auth.getAccessToken(),
                idToken: auth.getIdToken(),
                expiresAt: auth.getExpiresAt(),
            }));
            history.replace('/');
            console.error(error);
            alert(`Error while handling authentication. Check the console for further details.`);
        }
    }
};

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
            width: 1100,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    grid: {
        padding: 0,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing.unit * 6,
    },
});

class App extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <Helmet>
                    <title>Offshop</title>
                </Helmet>
                <CssBaseline />
                <header>
                    <Navigation auth={auth} />
                </header>
                <main>
                    <div className={classNames(classes.layout, classes.grid)}>
                        <Grid
                            container
                            alignContent="center"
                            alignItems="center"
                        >
                            <Switch>
                                <Route path="/" exact component={Products} />
                                <Route path="/products/:slug" exact component={Product} />
                                <Route path="/cart" exact component={Cart} />
                                <Route path="/order" exact component={Order} />
                                <Route path="/checkout" exact component={Checkout} />
                                <Route path="/callback" render={props => {
                                    handleAuthentication(props);
                                    return null;
                                }}/>
                                <Route path="/login" render={() => {
                                    auth.login();
                                    return null;
                                }}/>
                                <Route path="/logout" render={props => {
                                    auth.logout();
                                    store.dispatch(updateAuth({
                                        accessToken: auth.getAccessToken(),
                                        idToken: auth.getIdToken(),
                                        expiresAt: auth.getExpiresAt(),
                                    }));
                                    localStorage.removeItem(LOGGED_IN);
                                    props.history.replace('/');
                                    return null;
                                }}/>
                                <PrivateRoute path="/admin/products/list" exact component={AdminProducts}/>
                                <PrivateRoute path="/admin/products/new" exact component={AdminProductForm} />
                                <PrivateRoute path="/admin/products/:productId" exact component={AdminProductForm}/>
                                <PrivateRoute path="/admin/delivery-methods/list" exact component={AdminDeliveryMethods}/>
                                <PrivateRoute path="/admin/delivery-methods/new" exact component={AdminDeliveryMethodForm} />
                                <PrivateRoute path="/admin/delivery-methods/:id" exact component={AdminDeliveryMethodForm}/>
                            </Switch>
                        </Grid>
                    </div>
                </main>
                <footer className={classes.footer}>
                    <Typography
                        variant="subtitle1"
                        align="center"
                        color="textSecondary"
                        component="p"
                    >
                        Stworzone z miłości do żony
                    </Typography>
                </footer>
                <Notification/>
            </Fragment>
        );
    }
}

export default hot(module)(withStyles(styles)(App));
