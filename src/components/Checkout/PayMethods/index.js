import React, {Fragment, useState, useEffect} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PayByLink from './PayByLink';
import {getPayMethods} from '../../../api/payMethods';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: '100%',
        height: 'auto',
    },
});

const PayMethods = ({classes}) => {

    const [payByLinksMethods, setPayByLinksMethods] = useState([]);

    useEffect(() => {
        getPayMethods()
            .then(({data: {payByLinks}}) => setPayByLinksMethods(payByLinks))
            .catch(e => console.error(e));
    }, [payByLinksMethods.length]);

    return (
        <Fragment>
            <List disablePadding>
                {payByLinksMethods.map(tile => (
                    <Fragment>
                        <ListItem>
                            <PayByLink {...tile}/>
                        </ListItem>
                        <Divider />
                    </Fragment>
                ))}
            </List>
        </Fragment>
    );
};

export default withStyles(styles)(PayMethods);
