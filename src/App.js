import React, { Component, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import Navigation from './containers/Navigation';
import Products from './containers/Products';
import Cart from './containers/Cart';
import Checkout from './containers/Checkout';
import Order from './containers/Order';
import Login from './containers/Login';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import { hot } from 'react-hot-loader';
import Notification from './containers/Notification';

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
                <CssBaseline />
                <header>
                    <Navigation />
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
                                <Route path="/cart" exact component={Cart} />
                                <Route path="/order" exact component={Order} />
                                <Route path="/checkout" exact component={Checkout} />
                                <Route path="/login" exact component={Login} />
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
