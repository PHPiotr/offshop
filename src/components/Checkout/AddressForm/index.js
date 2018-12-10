import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

function AddressForm() {
    return (
        <Grid container spacing={24}>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    id="firstName"
                    name="firstName"
                    label="Imię"
                    fullWidth
                    autoComplete="fname"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    id="lastName"
                    name="lastName"
                    label="Nazwisko"
                    fullWidth
                    autoComplete="lname"
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    id="address1"
                    name="address1"
                    label="Adres linia 1"
                    fullWidth
                    autoComplete="billing address-line1"
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    id="addiress2"
                    name="addiress2"
                    label="Adres linia 2"
                    fullWidth
                    autoComplete="billing address-line2"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    id="city"
                    name="city"
                    label="Miasto"
                    fullWidth
                    autoComplete="billing address-level2"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    id="state"
                    name="state"
                    label="Województwo"
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    id="zip"
                    name="zip"
                    label="Kod pocztowy"
                    fullWidth
                    autoComplete="billing postal-code"
                />
            </Grid>
        </Grid>
    );
}

export default AddressForm;
