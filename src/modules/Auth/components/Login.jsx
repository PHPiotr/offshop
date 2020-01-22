import React, {useEffect} from 'react';
import {useAuth} from '../../../contexts/AuthContext';
import ProgressIndicator from '../../../components/ProgressIndicator';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

const Login = props => {
    const auth = useAuth();
    useEffect(() => {
        if (props.auth.expiresAt > (new Date()).getTime()) {
            props.history.goBack();
        } else {
            auth.login();
        }
    }, []);
    return <ProgressIndicator/>;
};

const mapStateToProps = state => ({
    auth: state.auth,
});

export default withRouter(connect(mapStateToProps)(Login));
