import React, {useContext, useEffect} from 'react';
import {connect} from 'react-redux';
import {FormControlLabel, Radio, Typography, RadioGroup} from '@material-ui/core';
import {
    onCreateDeliveryMethod,
    onDeleteDeliveryMethod,
    onUpdateDeliveryMethod,
    setCurrentDeliveryMethod,
} from '../actions';
import PropTypes from 'prop-types';
import {showNotification} from '../../../actions/notification';
import SocketContext from '../../../contexts/SocketContext';

const DeliveryMethods = props => {

    const {
        onCreateDeliveryMethod,
        onDeleteDeliveryMethod,
        onUpdateDeliveryMethod,
        showNotification,
    } = props;
    const socket = useContext(SocketContext);

    const handleSetCurrentDeliveryMethod = e => {
        props.setCurrentDeliveryMethod(props.deliveryMethods.find(s => s.id === e.target.value));
    };

    const onCreateDelivery = payload => {
        onCreateDeliveryMethod(payload);
        showNotification({
            message: `Opcja dostawy ${payload.name} została dodana.`,
            variant: 'warning',
        });
    };

    const onDeleteDelivery = payload => {
        onDeleteDeliveryMethod(payload);
        showNotification({
            message: `Opcja dostawy ${payload.name} została usunięta.`,
            variant: 'warning',
        });
    };

    const onUpdateDelivery = payload => {
        onUpdateDeliveryMethod(payload);
        showNotification({
            message: `Opcja dostawy ${payload.name} została zmieniona.`,
            variant: 'warning',
        });
    };

    useEffect(() => {
        socket.on('createDelivery', onCreateDelivery);
        socket.on('updateDelivery', onUpdateDelivery);
        socket.on('deleteDelivery', onDeleteDelivery);
        return () => {
            socket.off('createDelivery', onCreateDelivery);
            socket.off('updateDelivery', onUpdateDelivery);
            socket.off('deleteDelivery', onDeleteDelivery);
        }
    }, []);

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
const mapDispatchToProps = {
    setCurrentDeliveryMethod,
    onCreateDeliveryMethod,
    onUpdateDeliveryMethod,
    onDeleteDeliveryMethod,
    showNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryMethods);
