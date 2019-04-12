import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getPayMethodsIfNeeded} from '../../../actions/payMethods';

class PayMethods extends Component {

    constructor(props) {
        super(props);
        this.handleRetrievePayMethods = this.handleRetrievePayMethods.bind(this);
    }

    componentDidMount() {
        this.handleRetrievePayMethods();
    }

    handleRetrievePayMethods() {
        this.props.getPayMethodsIfNeeded();
    }

    render() {
        return (
            <div>
                {this.props.payMethodsIds.map(id => (
                    <img width="100" src={this.props.payMethods[id].brandImageUrl}/>
                ))}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    payMethods: state.payMethods.data,
    payMethodsIds: state.payMethods.ids,
});
const mapDispatchToProps = {
    getPayMethodsIfNeeded
};


export default connect(mapStateToProps, mapDispatchToProps)(PayMethods);
