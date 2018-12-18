import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const AddressForm = props => {

    return (
        <Grid container spacing={24}>
            {props.shipping.itemIds.map(itemId => {

                const {required, label, value, type} = props.shipping.items[itemId];
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
                            onChange={props.setShippingInputValue}
                        />
                    </Grid>
                )
            })}
        </Grid>
    );
};

export default AddressForm;
