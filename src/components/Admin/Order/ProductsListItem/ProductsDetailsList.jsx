import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import NestedListItem from '../../../List/NestedListItem';

const ProductsDetailsList = ({products, currencyCode}) => (
    <List component="div" disablePadding>
        {(products || []).map(({name, quantity, unitPrice}) => (
            <NestedListItem key={name}>
                <ListItemText
                    primary={`${name} (${quantity} szt.)`}
                    secondary={`${(unitPrice / 100).toFixed(2)} ${currencyCode} / szt`}
                />
            </NestedListItem>
        ))}
    </List>
);

export default ProductsDetailsList;
