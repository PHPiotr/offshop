import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import * as PropTypes from 'prop-types';

const styles = theme => ({
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit,
    },
});

const GooglePayButton = ({classes}) => (
    <div
        id="google-pay-btn-wrapper"
        className={classes.button}
    />
);

GooglePayButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GooglePayButton);

