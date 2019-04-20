import React, {Fragment, useState, useEffect} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import PayByLink from './PayByLink';
import {getPayMethods} from '../../../api/payMethods';

const PayMethods = () => {

    const [payByLinksMethods, setPayByLinksMethods] = useState([]);

    useEffect(() => {
        getPayMethods()
            .then(({data: {payByLinks}}) => setPayByLinksMethods(payByLinks))
            .catch(e => console.error(e));
    }, [payByLinksMethods.length]);

    return (
        <List disablePadding>
            {payByLinksMethods.map(tile => (
                <Fragment key={tile.value}>
                    <ListItem>
                        <PayByLink {...tile}/>
                    </ListItem>
                    <Divider />
                </Fragment>
            ))}
        </List>
    );
};

export default PayMethods;
