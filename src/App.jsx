import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import Navigation from './components/NavigationBar';
import Products from './modules/Products/components/Products';
import Product from './modules/Products/components/Product';
import Cart from './modules/ShoppingCart/components/ShoppingCart';
import Checkout from './modules/Checkout/components/Checkout';
import Order from './modules/Orders/components/Order';
import AddProduct from './modules/Products/components/Admin/AddProduct';
import EditProduct from './modules/Products/components/Admin/EditProduct';
import AdminProducts from './modules/Products/components/Admin/ProductsList';
import AddDeliveryMethod from './modules/Delivery/components/Admin/AddDeliveryMethod';
import EditDeliveryMethod from './modules/Delivery/components/Admin/EditDeliveryMethod';
import AdminDeliveryMethods from './modules/Delivery/components/Admin/DeliveryMethodsList';
import AdminOrders from './modules/Orders/components/Admin/OrdersList';
import AdminOrder from './modules/Orders/components/Admin/Order';
import {withStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import {hot} from 'react-hot-loader';
import Typography from '@material-ui/core/Typography';
import NotificationBar from './components/NotificationBar';
import PrivateRoute from './components/PrivateRoute';
import LoginCallbackHandler from './modules/Auth/components/LoginCallbackHandler';
import Logout from './modules/Auth/components/Logout';
import Login from './modules/Auth/components/Login';
import NotFound from './components/NotFound';

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

const pageTitle = process.env.REACT_APP_MERCHANT_NAME;

const App = props => {
    const {classes} = props;
    return (
        <>
            <Helmet>
                <title>{pageTitle}</title>
            </Helmet>
            <div className={classes.container}>
                <CssBaseline/>
                <header>
                    <Navigation/>
                </header>
                <main>
                    <div className={classNames(classes.layout, classes.grid)}>
                        <Grid
                            container
                            alignContent="center"
                            alignItems="center"
                        >
                            <Switch>
                                <Route path="/" exact component={Products}/>
                                <Route path="/products/:slug" component={Product}/>
                                <Route path="/cart" component={Cart}/>
                                <Route path="/order" component={Order}/>
                                <Route path="/checkout" component={Checkout}/>
                                <Route path="/callback" component={LoginCallbackHandler}/>
                                <Route path="/login" component={Login}/>;
                                <PrivateRoute path="/logout" component={Logout}/>
                                <PrivateRoute path="/admin/products/list" component={AdminProducts}/>
                                <PrivateRoute path="/admin/products/new" component={AddProduct}/>
                                <PrivateRoute path="/admin/products/:id" component={EditProduct}/>
                                <PrivateRoute path="/admin/delivery-methods/list" component={AdminDeliveryMethods}/>
                                <PrivateRoute path="/admin/orders/list" component={AdminOrders}/>
                                <PrivateRoute path="/admin/orders/:id" component={AdminOrder}/>
                                <PrivateRoute path="/admin/delivery-methods/new" component={AddDeliveryMethod}/>
                                <PrivateRoute path="/admin/delivery-methods/:id" component={EditDeliveryMethod}/>
                                <Route path="/*" component={NotFound}/>
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
                        {`${process.env.REACT_APP_FOOTER_TEXT}`}
                    </Typography>
                </footer>
            </div>
            <NotificationBar/>
        </>
    );
};

export default hot(module)(withStyles(styles)(App));
