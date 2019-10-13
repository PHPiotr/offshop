import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import NestedListItem from '../../../List/NestedListItem';

const BuyerDetailsList = ({buyer}) => (
    <List component="div" disablePadding>
        <NestedListItem>
            <ListItemText
                primary={buyer.firstName}
                secondary="Imię"
            />
        </NestedListItem>
        <NestedListItem>
            <ListItemText
                primary={buyer.lastName}
                secondary="Nazwisko"
            />
        </NestedListItem>
        <NestedListItem>
            <ListItemText
                primary={buyer.email}
                secondary="Adres e-mail"
            />
        </NestedListItem>
        <NestedListItem>
            <ListItemText
                primary={buyer.phone}
                secondary="Telefon"
            />
        </NestedListItem>
    </List>
);

export default BuyerDetailsList;
