import React from 'react';
import {connect} from 'react-redux';
import {Redirect, Route} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';

const PrivateRoute = ({component: Component, auth: authState, ...rest}) => {

    const auth = useAuth();
    const {isAuthenticated, renewSession} = auth;

    auth.accessToken = authState.accessToken;
    auth.idToken = authState.idToken;
    auth.expiresAt = authState.expiresAt;
    renewSession();

    return (
        <Route
            {...rest}
            render={props => {
                return isAuthenticated() ? (
                    <Component {...props}/>
                ) : (
                    <Redirect to="/login"/>
                )
            }}
        />
    );
};

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
