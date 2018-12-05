import React, {Component} from 'react';
import AppBar from './components/AppBar';
//import Amplify from 'aws-amplify';
import {Route, Switch} from 'react-router-dom';
//import aws_exports from './aws-exports';
import Home from './containers/Home';
import Login from './containers/Login';

//Amplify.configure(aws_exports);

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <AppBar/>
                </header>
                <Switch>
                    <Route path="/" exact component={Home}/>
                    <Route path="/login" exact component={Login} />
                </Switch>
            </div>
        );
    }
}

export default App;
