import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        zIndex: 1,
    },
    progress: {
        position: 'absolute',
        margin: theme.spacing(2),
        top: '50%',
        left: '50%',
        marginLeft: -20,
        marginTop: -20,
    },
});

const CircularIndeterminate = ({classes}) => (
    <div className={classes.overlay}>
        <CircularProgress className={classes.progress}/>
    </div>
);

CircularIndeterminate.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CircularIndeterminate);
