import React from 'react';
import CoreDialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';

const Dialog = props => (
    <CoreDialog
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        {props.title && <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>}
        {props.content && (
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.content}
                </DialogContentText>
            </DialogContent>
        )}
        {props.actions && props.actions.length && <DialogActions>{props.actions}</DialogActions>}
    </CoreDialog>
);

Dialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    content: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    actions: PropTypes.array,
};

Dialog.defaultProps = {
    title: null,
    content: null,
    actions: [],
};

export default Dialog;
