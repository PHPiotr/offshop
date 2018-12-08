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
    const {classes, cart, products, suppliers, setCurrentSupplier} = props;
    return (
        <div className={classes.root}>
            <div className={classes.section1}>
                <Typography gutterBottom variant="h6">
                    Wybierz sposób dostawy
                </Typography>
                <RadioGroup
                    name="position"
                    value={suppliers.currentId}
                    row
                >
                    {suppliers.items.map(({id, title, pricePerUnit}) => (
                        <FormControlLabel
                            key={id}
                            value={id}
                            control={<Radio color="primary"/>}
                            label={`${title}: ${pricePerUnit * cart.units} zł`}
                            labelPlacement="end"
                            checked={id === suppliers.currentId}
                            onChange={setCurrentSupplier}
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
                    <Grid item>
                        <Typography gutterBottom variant="h6">
                            {products.reduce((total, p) => (p.price * p.inCart + total), 0)} zł
                        </Typography>
                        <Typography gutterBottom variant="body2">
                            + dostawa {}
                        </Typography>
                    </Grid>
                </Grid>
            </div>
            <Divider variant="middle"/>
            <div className={classes.section3}>
                <Button variant="contained" color="primary" fullWidth>
                    Zapłać
                </Button>
            </div>
        </div>
    );
};

CartSummary.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CartSummary);
