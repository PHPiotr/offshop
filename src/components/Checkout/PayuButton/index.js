import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import * as PropTypes from 'prop-types';

const styles = theme => ({
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit,
        border: 0,
        height: '50px',
        width: '291px',
        background: 'url(http://static.payu.com/pl/standard/partners/buttons/payu_account_button_long_03.png) no-repeat',
        cursor: 'pointer',
        margin: 0,
        padding: 0,
    },
});

const PayuButton = ({classes}) => (
    <button id="pay-button" className={classes.button}></button>
);

PayuButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PayuButton);
