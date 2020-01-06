import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {Box, makeStyles, Typography, Grid} from '@material-ui/core';
import ProgressIndicator from '../components/ProgressIndicator';
import SubHeader from "../components/SubHeader";

const useStyles = makeStyles(theme => ({
    root: {
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
}));

const Order = props => {
    const classes = useStyles();
    if (props.order.isCreating) {
        return <ProgressIndicator/>;
    }
    return (
        <Box className={classes.root}>
            <SubHeader content={`Dziękujemy za zamówienie`}/>
            {props.order.data.extOrderId && (
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography variant="subtitle1">
                        {`Numer zamówienia:  ${props.order.data.extOrderId}`}
                    </Typography>
                </Grid>
            )}
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="subtitle1">
                    Więcej informacji w Twojej skrzynce e-mail.
                </Typography>
            </Grid>
        </Box>
    );
};

const mapStateToProps = state => ({
    order: state.order,
});

Order.propTypes = {
    order: PropTypes.shape({
        data: PropTypes.object,
        isCreating: PropTypes.bool,
    }).isRequired,
};

export default connect(mapStateToProps)(Order);
