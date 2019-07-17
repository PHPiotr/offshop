import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { setShippingInputValue } from '../../../actions/shipping';

const AddressForm = props => {
    const { inputKeys, inputs, setInputValue } = props;

    return (
        <Grid container spacing={10}>
            {inputKeys.map(itemId => {
                const { required, label, value, type } = inputs[itemId];

                return (
                    <Grid item xs={12} key={itemId}>
                        <TextField
                            required={required}
                            id={itemId}
                            name={itemId}
                            label={label}
                            fullWidth
                            value={value}
                            type={type}
                            onChange={setInputValue}
                        />
                    </Grid>
                );
            })}
        </Grid>
    );
};

const mapStateToProps = state => ({
    inputKeys: state.shipping.itemIds,
    inputs: state.shipping.items,
});

const mapDispatchToProps = dispatch => ({
    setInputValue: ({ target }) => {
        const { name, value } = target;
        dispatch(setShippingInputValue(name, value));
    },
});

AddressForm.propTypes = {
    inputKeys: PropTypes.array.isRequired,
    inputs: PropTypes.object.isRequired,
    setInputValue: PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddressForm);
