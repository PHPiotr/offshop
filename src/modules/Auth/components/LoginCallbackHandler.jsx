import React, {useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {useAuth} from '../../../contexts/AuthContext';
import {useSocket} from '../../../contexts/SocketContext';
import {updateAuth} from '../actions';

const LoginCallbackHandler = props => {
    const auth = useAuth();
    const socket = useSocket();
    useEffect(() => {
        (async () => {
            if (/access_token|id_token|error/.test(props.location.hash)) {
                try {
                    await auth.handleAuthentication();
                    props.updateAuth({
                        accessToken: auth.getAccessToken(),
                        idToken: auth.getIdToken(),
                        expiresAt: auth.getExpiresAt(),
                    });
                    socket.emit('userLoggedIn');
                    props.history.replace('/admin/orders/list');
                } catch (e) {
                    auth.logout();
                    props.updateAuth({
                        accessToken: null,
                        idToken: null,
                        expiresAt: 0,
                    });
                    props.history.replace('/login');
                }
            } else {
                props.history.goBack();
            }
        })();
    }, []);
    return null;
};

const mapDispatchToProps = {updateAuth};

export default withRouter(connect(null, mapDispatchToProps)(LoginCallbackHandler));
