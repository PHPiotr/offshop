import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    chip: {
        marginRight: theme.spacing.unit,
    },
    section1: {
        margin: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2}px`,
    },
    section2: {
        margin: theme.spacing.unit * 2,
    },
    section3: {
        margin: `${theme.spacing.unit * 6}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
    },
});

const CartSummary = (props) => {
    const {classes, cart, products, suppliers} = props;

    const handleSetCurrentSupplier = e => props.setCurrentSupplier(suppliers.find(s => s.id === e.target.value));

    return (
        <div className={classes.root}>
            <div className={classes.section1}>
                <Typography gutterBottom variant="h6">
                    Wybierz sposób dostawy
                </Typography>
                <RadioGroup name="position" value={props.currentSupplier.id}>
                    {suppliers.map(({id, title, pricePerUnit}) => (
                        <FormControlLabel
                            key={id}
                            value={id}
                            control={<Radio color="primary"/>}
                            label={`${title}: ${pricePerUnit * cart.units} zł`}
                            labelPlacement="end"
                            checked={id === props.currentSupplier.id}
                            onChange={handleSetCurrentSupplier}
                        />
                    ))}
                </RadioGroup>
            </div>
            <Divider variant="middle"/>
            <div className={classes.section1}>
                <Grid container alignItems="center">
                    <Grid item xs>
                        <Typography gutterBottom variant="h6">
                            Do zapłaty
                        </Typography>
                    </Grid>
                    <Grid item align="right">
                        <Typography gutterBottom variant="h6">
                            {`${products.reduce((total, p) => (p.price * p.inCart + total), 0) + (props.currentSupplier.pricePerUnit > 0 ? cart.units * props.currentSupplier.pricePerUnit : 0)} zł`}
                        </Typography>
                    </Grid>
                </Grid>
            </div>
            <Divider variant="middle"/>
            <div className={classes.section3}>
                <Button disabled variant="contained" color="primary">
                    Zapłać
                </Button>
            </div>
        </div>
    );
};

CartSummary.propTypes = {
    classes: PropTypes.object.isRequired,
    cart: PropTypes.object.isRequired,
    products: PropTypes.array.isRequired,
    suppliers: PropTypes.array.isRequired,
    currentSupplier: PropTypes.object.isRequired,
};

export default withStyles(styles)(CartSummary);
