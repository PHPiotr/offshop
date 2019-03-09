import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import * as PropTypes from 'prop-types';

const styles = theme => ({
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit,
    },
});

const GooglePayButton = ({classes, show}) => (
    <div
        id="google-pay-btn-wrapper"
        className={classes.button}
        style={{display: show ? 'block' : 'none'}}
    />
);

GooglePayButton.propTypes = {
    show: PropTypes.bool.isRequired,
};

export default withStyles(styles)(GooglePayButton);

