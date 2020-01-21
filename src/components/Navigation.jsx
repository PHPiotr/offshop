import React from 'react';
import { connect } from 'react-redux';
import AppBar from './AppBar';

const Navigation = props => <AppBar {...props} />;

const mapStateToProps = state => ({
    appBar: state.appBar,
    cart: state.cart,
    isAuthenticated: new Date().getTime() < state.auth.expiresAt,
});

export default connect(mapStateToProps)(Navigation);
