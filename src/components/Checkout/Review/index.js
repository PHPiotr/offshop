import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';

const payments = [
    {name: 'Card type', detail: 'Visa'},
    {name: 'Card holder', detail: 'Mr John Smith'},
    {name: 'Card number', detail: 'xxxx-xxxx-xxxx-1234'},
    {name: 'Expiry date', detail: '04/2024'},
];

const styles = theme => ({
    paper: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            marginTop: theme.spacing.unit * 6,
            marginBottom: theme.spacing.unit * 6,
            padding: theme.spacing.unit * 3,
        },
    },
    stepper: {
        padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`,
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit,
    },
    listItem: {
        padding: `${theme.spacing.unit}px 0`,
    },
    total: {
        fontWeight: '700',
    },
    title: {
        marginTop: theme.spacing.unit * 2,
    },
});

function Review(props) {
    const {classes} = props;
    return (
        <Fragment>
            <List disablePadding>
                {props.products.map(product => (
                    <ListItem className={classes.listItem} key={product.id}>
                        <ListItemText primary={product.title} secondary={`${product.inCart} szt.`}/>
                        <Typography
                            variant="body2">{`${parseFloat(product.price).toFixed(2)} x ${product.inCart} = ${parseFloat(product.price * product.inCart).toFixed(2)} zł`}</Typography>
                    </ListItem>
                ))}
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Do zapłaty"/>
                    <Typography variant="subtitle1" className={classes.total}>
                        {`${parseFloat(props.totalPrice).toFixed(2)} zł`}
                    </Typography>
                </ListItem>
            </List>
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom className={classes.title}>
                        Dane do wysyłki
                    </Typography>
                    {props.shipping.itemIds.map(itemId => {
                        const {label, value} = props.shipping.items[itemId];
                        return (
                            <Typography gutterBottom>{`${label}: ${value}`}</Typography>
                        )
                    })}
                </Grid>
                <Grid item container direction="column" xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom className={classes.title}>
                        Szczegóły płatności
                    </Typography>
                    <Grid container>
                        {payments.map(payment => (
                            <React.Fragment key={payment.name}>
                                <Grid item xs={6}>
                                    <Typography gutterBottom>{payment.name}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography gutterBottom>{payment.detail}</Typography>
                                </Grid>
                            </React.Fragment>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Fragment>
    );
}

Review.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Review);
