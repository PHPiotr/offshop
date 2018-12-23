import React, { Component } from 'react';
import {connect} from "react-redux";
import {retrieveOrder} from "../../actions/order";

class Order extends Component {
    componentDidMount() {
        this.props.retrieveOrder();
    }

    render() {
        return (<h1>Zamówienie</h1>);
    }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = (dispatch, ownProps) => ({
    retrieveOrder() {
        dispatch(retrieveOrder(ownProps.match.params.extOrderId));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Order);
