import React, { Component, Fragment } from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import Navigation from './components/Navigation';
import Products from './modules/Products/components/Products';
import Product from './modules/Products/components/Product';
import Cart from './modules/ShoppingCart/components/ShoppingCart';
import Checkout from './modules/Checkout/components/Checkout';
import Order from './modules/Orders/components/Order';
import AdminProductForm from './modules/Products/components/Admin/ProductForm';
import AdminProducts from './modules/Products/components/Admin/ProductsList';
import AdminDeliveryMethodForm from './modules/Delivery/components/Admin/DeliveryMethodForm';
import AdminDeliveryMethods from './modules/Delivery/components/Admin/DeliveryMethodsList';
import AdminOrders from './modules/Orders/components/Admin/OrdersList';
import AdminOrder from './modules/Orders/components/Admin/Order';
import NotFound from './components/NotFound';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import { hot } from 'react-hot-loader';
import Auth from './services/auth';
import store from './store';
import {updateAuth} from './actions/auth';
import Typography from '@material-ui/core/Typography';
import NotificationBar from './components/NotificationBar';

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
            history.replace('/admin/orders/list');
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
    container: {
        position: 'relative',
        minHeight: '100vh',
    },
    layout: {
        width: 'auto',
        marginLeft: 0,
        marginRight: 0,
        [theme.breakpoints.up(1100 + theme.spacing(6))]: {
            width: 1100,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    grid: {
        padding: 0,
        paddingBottom: theme.spacing(5),
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
});

const pageTitle = process.env.REACT_APP_PAGE_TITLE || 'Offshop';

class App extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <Helmet>
                    <title>{pageTitle}</title>
                </Helmet>
                <div className={classes.container}>
                    <CssBaseline/>
                    <header>
                        <Navigation auth={auth}/>
                    </header>
                    <main>
                        <div className={classNames(classes.layout, classes.grid)}>
                            <Grid
                                container
                                alignContent="center"
                                alignItems="center"
                            >
                                <Switch>
                                    <Route path="/" exact render={props => <Products {...props} />}/>
                                    <Route path="/products/:slug" exact render={props => <Product {...props} product={store.getState().product.data[store.getState().product.id] || {}} />}/>
                                    <Route path="/cart" exact render={props => <Cart {...props} />}/>
                                    <Route path="/order" exact component={Order}/>
                                    <Route path="/checkout" exact render={props => <Checkout {...props} />}/>
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
                                    <PrivateRoute path="/admin/products/new" exact component={AdminProductForm} key="add"/>
                                    <PrivateRoute path="/admin/products/:productId" exact component={AdminProductForm} key="edit"/>
                                    <PrivateRoute path="/admin/delivery-methods/list" exact
                                                  component={AdminDeliveryMethods}/>
                                    <PrivateRoute path="/admin/orders/list" exact
                                                  component={AdminOrders}/>
                                    <PrivateRoute path="/admin/orders/:id" exact
                                                  component={AdminOrder}/>
                                    <PrivateRoute path="/admin/delivery-methods/new" exact
                                                  component={AdminDeliveryMethodForm} key="add"/>
                                    <PrivateRoute path="/admin/delivery-methods/:id" exact
                                                  component={AdminDeliveryMethodForm} key="edit"/>
                                    <Route path="/*" component={NotFound} />
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
                </div>
                <NotificationBar/>
            </Fragment>
        );
    }
}

export default hot(module)(withStyles(styles)(App));
