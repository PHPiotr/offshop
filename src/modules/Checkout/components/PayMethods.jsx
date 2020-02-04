import React, {Fragment, useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {Divider, List, ListItem, Typography} from '@material-ui/core';
import PayByLink from './PayByLink';
import PayuExpress from './PayuExpress';
import GooglePay from './GooglePay';
import {authorize} from '../../../api/payu';
import {getRequestPrivate} from '../../../api';
import {showNotification} from '../../../actions/notification';

const useStyles = makeStyles(theme => ({
    listItem: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
}));
const PayMethods = props => {

    const classes = useStyles();
    const [payByLinksMethods, setPayByLinksMethods] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const {data: {access_token: accessToken}} = await authorize();
                const {data: {payByLinks}} = await getRequestPrivate(accessToken)('/pay-methods');
                setPayByLinksMethods(payByLinks);
            } catch (e) {
                setError(e);
                props.showNotification({
                    message: e.message,
                    variant: 'error',
                });
            }
        })();
    }, [payByLinksMethods.length]);

    if (error) {
        return null;
    }

    return (
        <>
            <Typography variant="subtitle1" gutterBottom className={classes.title}>
                Wybierz metodę płatności
            </Typography>
            <List disablePadding>
                <ListItem className={classes.listItem}>
                    <PayuExpress/>
                </ListItem>
                <ListItem className={classes.listItem}>
                    <GooglePay/>
                </ListItem>
                {payByLinksMethods.map(tile => (
                    <Fragment key={tile.value}>
                        <ListItem className={classes.listItem}>
                            <PayByLink {...tile}/>
                        </ListItem>
                        <Divider/>
                    </Fragment>
                ))}
            </List>
        </>
    );
};

export default connect(null, {showNotification})(PayMethods);
