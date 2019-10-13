import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(3),
    },
}));

const NestedListItem = props => {
    const classes = useStyles();
    const {children, ...rest} = props;
    return (
        <ListItem {...rest} className={classes.nested}>
            {children}
        </ListItem>
    );
};

export default NestedListItem;
