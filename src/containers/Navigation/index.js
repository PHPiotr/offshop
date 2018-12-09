import React, {Component} from 'react';
import {connect} from 'react-redux';
import AppBar from "../../components/AppBar";

class Navigation extends Component {
    render() {
        return (
            <AppBar {...this.props} />
        );
    }
}

const mapStateToProps = (state) => ({
    cart: state.cart,
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
