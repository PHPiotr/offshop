import React, {Component} from 'react';
import {connect} from 'react-redux';
import AppBar from "../../components/AppBar";

class Header extends Component {

    render() {
        return (
            <header className="App-header">
                <AppBar {...this.props} />
            </header>
        );
    }
}

const mapStateToProps = (state) => ({
    cart: state.cart,
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
