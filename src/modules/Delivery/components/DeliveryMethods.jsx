import React from 'react';
import {connect} from 'react-redux';
import {FormControlLabel, Radio, Typography, RadioGroup} from '@material-ui/core';
import {setCurrentDeliveryMethod} from '../actions';
import PropTypes from 'prop-types';

const DeliveryMethods = props => {

    const handleSetCurrentDeliveryMethod = e => {
        props.setCurrentDeliveryMethod(props.deliveryMethods.find(s => s.id === e.target.value));
    };

    return (
        <RadioGroup name="position" defaultValue={props.currentDeliveryMethod.id}>
            {props.deliveryMethods.map(({ id, name, unitPrice }) => (
                <FormControlLabel
                    data-testid={`radio-btn-${id}`}
                    key={id}
                    value={id}
                    control={<Radio color="primary" />}
                    label={
                        <React.Fragment>
                            <Typography component="span" color="textPrimary">
                                <span>{name}</span>
                            </Typography>
                            <Typography component="span" color="textSecondary">
                                &nbsp;<span>{`${(unitPrice * (props.cart.weight / 100) / 100).toFixed(2)}`}</span> zł
                            </Typography>
                        </React.Fragment>
                    }
                    labelPlacement="end"
                    checked={id === props.currentDeliveryMethod.id}
                    onChange={handleSetCurrentDeliveryMethod}
                />
            ))}
        </RadioGroup>
    );
};

DeliveryMethods.propTypes = {
    cart: PropTypes.object.isRequired,
    deliveryMethods: PropTypes.array.isRequired,
    currentDeliveryMethod: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    cart: state.cart,
    deliveryMethods: state.deliveryMethods.ids.map(i => state.deliveryMethods.data[i]),
    currentDeliveryMethod: state.deliveryMethods.data[state.deliveryMethods.currentId] || {},
});
const mapDispatchToProps = {setCurrentDeliveryMethod};

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryMethods);
