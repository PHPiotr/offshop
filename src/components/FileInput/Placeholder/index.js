import React from 'react';
import PropTypes from 'prop-types';
import AddPhotoIcon from '@material-ui/icons/AddAPhoto';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = () => ({
    root: {
        cursor: 'pointer',
        textAlign: 'left',
        height: '100%',
        width: '100%',
    },
    error: {
        border: '2px solid #f44336',
    },
    photoIcon: {
        fontSize: 50,
    },
});

const Placeholder = ({getInputProps, getRootProps, classes}) => (
    <div {...getRootProps()} className={`${classes.root}`}>
        <input {...getInputProps()} />
        <AddPhotoIcon className={classes.photoIcon}/>
    </div>
);

Placeholder.propTypes = {
    getInputProps: PropTypes.func.isRequired,
    getRootProps: PropTypes.func.isRequired,
};

export default withStyles(styles)(Placeholder);
