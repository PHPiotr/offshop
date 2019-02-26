import React, { Component } from 'react';

class Login extends Component {
    componentDidMount() {
        return this.props.auth.login();
    }
    render() {
        return null;
    }
}

export default Login;
