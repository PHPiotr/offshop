import React, {useEffect} from 'react';
import {useAuth} from '../../../contexts/AuthContext';
import {removeLoggedInItem, setLoggedInItem} from '../../../utils/localStorage';
import {updateAuth} from '../actions';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

const LoginCallbackHandler = props => {
    const auth = useAuth();
    useEffect(() => {
        (async () => {
            if (/access_token|id_token|error/.test(props.location.hash)) {
                try {
                    await auth.handleAuthentication();
                    setLoggedInItem(true);
                    props.updateAuth({
                        accessToken: auth.getAccessToken(),
                        idToken: auth.getIdToken(),
                        expiresAt: auth.getExpiresAt(),
                    });
                    props.history.replace('/admin/orders/list');
                } catch (e) {
                    auth.logout();
                    props.updateAuth({
                        accessToken: null,
                        idToken: null,
                        expiresAt: 0,
                    });
                    removeLoggedInItem();
                    console.error(e);
                    props.history.replace('/login');
                }
            }
        })();
    }, []);
    return null;
};

const mapDispatchToProps = {updateAuth};

export default withRouter(connect(null, mapDispatchToProps)(LoginCallbackHandler));
