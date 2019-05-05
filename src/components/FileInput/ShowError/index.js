import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = () => ({
    root: {
        marginTop: '4px',
        color: '#f44336',
        margin: 0,
        fontSize: '0.75rem',
        textAlign: 'left',
        minHeight: '1em',
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        lineHeight: '1em',
    },
});

const ShowError = ({error, touched, classes}) =>
    touched && error ? (
        <div className={classes.root}>
            {error}
        </div>
    ) : null;

ShowError.propTypes = {
    error: PropTypes.string,
    touched: PropTypes.bool
};

export default withStyles(styles)(ShowError);
