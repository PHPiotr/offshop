import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import NestedListItem from '../../../../components/List/NestedListItem';

const OrderDetailsList = ({order}) => (
    <List component="div" disablePadding>
        <NestedListItem>
            <ListItemText
                primary={order.status}
                secondary="Status"
            />
        </NestedListItem>
        <NestedListItem>
            <ListItemText
                primary={(new Date(order.orderCreateDate)).toLocaleString('pl', {
                    dateStyle: 'short',
                    timeStyle: 'short'
                })}
                secondary="Data"
            />
        </NestedListItem>
        <NestedListItem>
            <ListItemText
                primary={`${(order.totalAmount / 100).toFixed(2)} ${order.currencyCode}`}
                secondary="Kwota z dostawą"
            />
        </NestedListItem>
        <NestedListItem>
            <ListItemText
                primary={`${(order.totalWithoutDelivery / 100).toFixed(2)} ${order.currencyCode}`}
                secondary="Kwota bez dostawy"
            />
        </NestedListItem>
        <NestedListItem>
            <ListItemText
                primary={`${(order.totalWeight / 100).toFixed(2)} kg`}
                secondary="Waga"
            />
        </NestedListItem>
        <NestedListItem>
            <ListItemText
                primary={order.extOrderId}
                secondary="Nr zamówienia widoczny dla klienta"
            />
        </NestedListItem>
        <NestedListItem>
            <ListItemText
                primary={order.orderId}
                secondary="Nr zamówienia w PayU (niewidoczny dla klienta)"
            />
        </NestedListItem>
        {order.properties.map(({name, value}) => (
            <NestedListItem key={name}>
                <ListItemText
                    primary={value}
                    secondary={name}
                />
            </NestedListItem>
        ))}
    </List>
);

export default OrderDetailsList;
