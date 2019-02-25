import React from 'react';
import PropTypes from 'prop-types';
import AddPhotoIcon from '@material-ui/icons/AddAPhoto';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = () => ({
    root: {
        cursor: 'pointer',
        textAlign: 'center',
        backgroundColor: '#efebeb',
        height: '100%',
        width: '100%',
    },
    error: {
        border: '2px solid #f44336',
    },
});

const Placeholder = ({getInputProps, getRootProps, error, touched, classes}) => (
    <div {...getRootProps()} className={`${classes.root} ${error && touched ? classes.error : ''}`}>
        <input {...getInputProps()} />
        <AddPhotoIcon style={{ fontSize: 50, marginTop: 140 }}/>
    </div>
);

Placeholder.propTypes = {
    error: PropTypes.string,
    getInputProps: PropTypes.func.isRequired,
    getRootProps: PropTypes.func.isRequired,
    touched: PropTypes.bool
};

export default withStyles(styles)(Placeholder);
