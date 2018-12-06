import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import Header from './containers/Header';
import Home from './containers/Home';
import Cart from './containers/Cart';
import Login from './containers/Login';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
});

class App extends Component {
    render() {
        const {classes} = this.props;
        return (
            <div className="App">
                <Header/>
                <div className={classes.root}>
                    <Switch>
                        <Route path="/" exact component={Home}/>
                        <Route path="/cart" exact component={Cart}/>
                        <Route path="/login" exact component={Login}/>
                    </Switch>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(App);
