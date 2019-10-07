import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Fab} from '@material-ui/core';
import {makeStyles} from '@material-ui/core';
import {Add} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        zIndex: 1,
    },
    iconLink: {
        color: theme.palette.primary.contrastText,
        lineHeight: 'normal',
    },
}));

const FloatingAddButton = props => {
    const classes = useStyles();
    const {color, label, to} = props;

    return (
        <Fab aria-label={label} className={classes.fab} color={color}>
            <Link className={classes.iconLink} to={to}>
                <Add />
            </Link>
        </Fab>
    );
};

FloatingAddButton.propTypes = {
    to: PropTypes.string.isRequired,
    label: PropTypes.string,
    color: PropTypes.string,
};

FloatingAddButton.defaultProps = {
    label: 'Dodaj',
    color: 'primary',
};

export default FloatingAddButton;
