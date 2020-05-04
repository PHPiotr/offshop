import React from 'react';
import Button from '@material-ui/core/Button/Button';
import {connect} from 'react-redux';
import {createOrderIfNeeded} from '../actions';

const PayAfterDelivery = props => {
    if (!props.currentDelivery.payAfterDelivery) {
        return null;
    }
    const handleOnClick = async () => {
        try {
            await props.createOrderIfNeeded();
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <Button
            variant="contained"
            color="primary"
            className={props.className}
            onClick={handleOnClick}
        >
            Kupuję i płacę przy odbiorze
        </Button>
    );
};

const mapStateToProps = state => ({
    currentDelivery: state.deliveryMethods.data[state.cart.deliveryId] || {},
});

const mapDispatchToProps = {createOrderIfNeeded};

export default connect(mapStateToProps, mapDispatchToProps)(PayAfterDelivery);
