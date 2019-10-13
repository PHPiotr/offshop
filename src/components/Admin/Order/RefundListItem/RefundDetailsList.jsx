import React from 'react';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import NestedListItem from '../../../List/NestedListItem';

const RefundDetailsList = props => {
    const {refund} = props;
    return (
        <List component="div" disablePadding>
            <NestedListItem>
                <ListItemText
                    primary={refund.status}
                    secondary="Status zwrotu"
                />
            </NestedListItem>
            <NestedListItem>
                <ListItemText
                    primary={`${(refund.amount / 100).toFixed(2)} ${refund.currencyCode}`}
                    secondary="Kwota zwrotu"
                />
            </NestedListItem>
            <NestedListItem>
                <ListItemText
                    primary={(new Date(refund.refundDate || refund.statusDateTime)).toLocaleString('pl', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                    })}
                    secondary="Data zwrotu"
                />
            </NestedListItem>
            {refund.description && (<NestedListItem>
                <ListItemText
                    primary={refund.description}
                    secondary="Opis zwrotu"
                />
            </NestedListItem>)}
            {refund.reason && (<NestedListItem>
                <ListItemText
                    primary={refund.reason}
                    secondary="Przyczyna zwrotu"
                />
            </NestedListItem>)}
            {refund.reasonDescription && (<NestedListItem>
                <ListItemText
                    primary={refund.reasonDescription}
                    secondary="Opis przyczyny zwrotu"
                />
            </NestedListItem>)}
            <NestedListItem>
                <ListItemText
                    primary={refund.refundId}
                    secondary="Numer zwrotu (refundId)"
                />
            </NestedListItem>
            <NestedListItem>
                <ListItemText
                    primary={refund.extRefundId}
                    secondary="Zewnętrzny numer zwrotu (extRefundId)"
                />
            </NestedListItem>
        </List>
    );
};

export default RefundDetailsList;
