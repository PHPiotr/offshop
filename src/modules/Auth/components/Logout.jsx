import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {useAuth} from '../../../contexts/AuthContext';
import {useSocket} from '../../../contexts/SocketContext';
import {updateAuth} from '../actions';

const Logout = props => {
    const auth = useAuth();
    const socket = useSocket();
    useEffect(() => {
        auth.logout();
        props.updateAuth({
            accessToken: null,
            idToken: null,
            expiresAt: 0,
        });
        socket.emit('userLoggedOut');
        props.history.replace('/');
    }, []);
    return null;
};

const mapDispatchToProps = {updateAuth};

export default withRouter(connect(null, mapDispatchToProps)(Logout));
