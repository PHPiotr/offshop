import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
}));

const ButtonListItem = props => {
    const classes = useStyles();
    const {children, ...rest} = props;
    return (
        <ListItem {...rest} button className={classes.nested}>
            {children}
        </ListItem>
    );
};

export default ButtonListItem;
