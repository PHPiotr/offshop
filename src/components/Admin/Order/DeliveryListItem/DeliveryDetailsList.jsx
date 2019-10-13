import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import NestedListItem from '../../../List/NestedListItem';

const DeliveryDetailsList = props => {
    const {currencyCode, delivery, deliveryMethod} = props;
    return (
        <List component="div" disablePadding>
            <NestedListItem>
                <ListItemText
                    primary={`${deliveryMethod.name} (${(deliveryMethod.unitPrice / 100).toFixed(2)} ${currencyCode} / kg)`}
                    secondary="Wybrana opcja"
                />
            </NestedListItem>
            <NestedListItem>
                <ListItemText
                    primary={delivery.recipientName}
                    secondary="Odbiorca"
                />
            </NestedListItem>
            <NestedListItem>
                <ListItemText
                    primary={delivery.postalCode}
                    secondary="Kod pocztowy"
                />
            </NestedListItem>
            <NestedListItem>
                <ListItemText
                    primary={delivery.city}
                    secondary="Miasto"
                />
            </NestedListItem>
            <NestedListItem>
                <ListItemText
                    primary={delivery.street}
                    secondary="Ulica"
                />
            </NestedListItem>
        </List>
    );
};

export default DeliveryDetailsList;
