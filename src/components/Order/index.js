import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography/index";
import Paper from '@material-ui/core/Paper/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import SubHeader from "../SubHeader";
import Grid from "@material-ui/core/Grid/index";

const styles = theme => ({
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(6))]: {
            marginTop: 0,
            marginBottom: 0,
            padding: theme.spacing(3),
        },
        width: '100%',
    },
});

const Order = ({classes, extOrderId}) => (
    <Fragment>
        <SubHeader content={`Zamówienie`}/>
        <Paper className={classes.paper}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="subtitle1">
                    {`Numer zamówienia:  ${extOrderId}`}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="subtitle1">
                    Więcej informacji w Twojej skrzynce e-mail.
                </Typography>
            </Grid>
        </Paper>
    </Fragment>
);

Order.propTypes = {
    extOrderId: PropTypes.string.isRequired,
};

export default withStyles(styles)(Order);
