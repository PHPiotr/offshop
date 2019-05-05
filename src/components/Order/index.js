import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography/index";
import Paper from '@material-ui/core/Paper/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import SubHeader from "../SubHeader";
import {injectIntl, FormattedMessage} from 'react-intl';
import Grid from "@material-ui/core/Grid/index";

const styles = theme => ({
    paper: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            marginTop: 0,
            marginBottom: 0,
            padding: theme.spacing.unit * 3,
        },
        width: '100%',
    },
});

const Order = ({classes, intl, extOrderId}) => (
    <Fragment>
        <SubHeader content={intl.formatMessage({id: 'order.thanks'})}/>
        <Paper className={classes.paper}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="subheading">
                    <FormattedMessage id="order.number" values={{extOrderId: extOrderId}}/>
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="subheading">
                    <FormattedMessage id="order.info"/>
                </Typography>
            </Grid>
        </Paper>
    </Fragment>
);

Order.propTypes = {
    extOrderId: PropTypes.string.isRequired,
};

export default injectIntl(withStyles(styles)(Order));
