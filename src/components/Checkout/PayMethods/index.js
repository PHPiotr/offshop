import React, {Fragment, useState, useEffect} from 'react';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import PayByLink from './PayByLink';
import PayuExpress from './PayuExpress';
import GooglePay from './GooglePay';
import {getPayMethods} from '../../../api/payMethods';
import {authorize} from '../../../api/payu';

const styles = theme => ({
    listItem: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
});

const PayMethods = props => {

    const {classes} = props;
    const [payByLinksMethods, setPayByLinksMethods] = useState([]);

    useEffect(() => {
        authorize().then(({data: {access_token}}) => {
            getPayMethods(access_token)
                .then(({data: {payByLinks}}) => setPayByLinksMethods(payByLinks))
                .catch(e => console.error(e));
        }).catch(e => console.error(e));
    }, [payByLinksMethods.length]);

    return (
        <List disablePadding>
            <ListItem className={classes.listItem}>
                <PayuExpress />
            </ListItem>
            <ListItem className={classes.listItem}>
                <GooglePay />
            </ListItem>
            {payByLinksMethods.map(tile => (
                <Fragment key={tile.value}>
                    <ListItem className={classes.listItem}>
                        <PayByLink {...tile}/>
                    </ListItem>
                    <Divider />
                </Fragment>
            ))}
        </List>
    );
};

export default withStyles(styles)(PayMethods);
