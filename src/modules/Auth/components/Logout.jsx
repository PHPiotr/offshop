import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {useAuth} from '../../../contexts/AuthContext';
import {updateAuth} from '../actions';
import {removeLoggedInItem} from '../../../utils/localStorage';

const Logout = props => {
    const auth = useAuth();
    useEffect(() => {
        auth.logout();
        props.updateAuth({
            accessToken: null,
            idToken: null,
            expiresAt: 0,
        });
        removeLoggedInItem();
        props.history.replace('/');
    }, []);
    return null;
};

const mapDispatchToProps = {updateAuth};

export default withRouter(connect(null, mapDispatchToProps)(Logout));
