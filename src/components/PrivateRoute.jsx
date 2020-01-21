import React from 'react';
import {connect} from 'react-redux';
import {Redirect, Route} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import {getLoggedInItem} from '../utils/localStorage';

const PrivateRoute = ({component: Component, auth: authState, ...rest}) => {

    const auth = useAuth();
    const {isAuthenticated, renewSession} = auth;

    let isLoggedIn;
    try {
        isLoggedIn = getLoggedInItem() === 'true';
    } catch (e) {
        console.log(e);
        isLoggedIn = false;
    }

    if (isLoggedIn) {
        auth.accessToken = authState.accessToken;
        auth.idToken = authState.idToken;
        auth.expiresAt = authState.expiresAt;
        renewSession();
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

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
