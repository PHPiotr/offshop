import React from 'react';
import {connect} from 'react-redux';
import {Redirect, Route} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import {useSocket} from '../contexts/SocketContext';

const PrivateRoute = ({component: Component, auth: authState, ...rest}) => {

    const auth = useAuth();
    const socket = useSocket();
    const {isAuthenticated, renewSession} = auth;
    const isAuthenticatedBefore = isAuthenticated();

    auth.accessToken = authState.accessToken;
    auth.idToken = authState.idToken;
    auth.expiresAt = authState.expiresAt;
    renewSession();

    return (
        <Route
            {...rest}
            render={props => {
                if (isAuthenticated()) {
                    if (!isAuthenticatedBefore) {
                        socket.emit('userLoggedIn');
                    }
                    return <Component {...props}/>;
                }
                return <Redirect to="/login"/>;
            }}
        />
    );
};

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
