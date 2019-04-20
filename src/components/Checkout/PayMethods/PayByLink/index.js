import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import * as PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createOrderIfNeeded, handleCreateOrderError} from '../../../../actions/order';

const styles = theme => ({
    button: {
        marginTop: 0,
        marginLeft: 0,
        border: 'none',
        height: 'auto',
        auto: 'auto',
        cursor: 'pointer',
        margin: 0,
        padding: 0,
    },
});

const PayByLink = props => {
    const payMethods = {
        payMethod: {
            value: props.value,
            type: 'PBL',
        }
    };
    return (
        <button id="pay-button" className={props.classes.button} onClick={() => props.createOrderIfNeeded(payMethods)}>
            <img height="50" src={props.brandImageUrl} title={props.name} alt={props.name} />
        </button>
    );
};

PayByLink.propTypes = {
    brandImageUrl: PropTypes.string.isRequired,
    maxAmount: PropTypes.number.isRequired,
    minAmount: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    totalAmount: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
    totalAmount: ((state.cart.totalPrice + state.deliveryMethods.data[state.deliveryMethods.currentId].unitPrice * 100 * state.cart.quantity) / 100).toFixed(2),
});

export default connect(mapStateToProps, {createOrderIfNeeded, handleCreateOrderError})(withStyles(styles)(PayByLink));
