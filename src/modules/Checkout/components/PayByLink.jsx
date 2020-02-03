import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import * as PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createOrderIfNeeded, handleCreateOrderError} from '../actions';

const styles = () => ({
    button: {
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: 0,
    },
});

const PayByLink = props => {
    const handleOnClick = (payMethods) => async () => {
        try {
            await props.createOrderIfNeeded(payMethods);
        } catch (e) {
            props.handleCreateOrderError(e);
        }
    };
    const payMethods = {
        payMethod: {
            value: props.value,
            type: 'PBL',
        }
    };
    return (
        <button data-testid={`pay-button-${props.value}`} className={props.classes.button} onClick={handleOnClick(payMethods)}>
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
    totalAmount: ((state.cart.totalPrice + state.deliveryMethods.data[state.deliveryMethods.currentId].unitPrice * 100 * state.cart.weight) / 100).toFixed(2),
});

export default connect(mapStateToProps, {createOrderIfNeeded, handleCreateOrderError})(withStyles(styles)(PayByLink));
