import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppBar from '../components/AppBar';

class Navigation extends Component {
    render() {
        return <AppBar {...this.props} />;
    }
}

const mapStateToProps = state => ({
    appBar: state.appBar,
    cart: state.cart,
    isAuthenticated: new Date().getTime() < state.auth.expiresAt,
});

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navigation);
