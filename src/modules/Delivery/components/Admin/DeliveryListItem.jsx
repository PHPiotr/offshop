import React, {Fragment, useState} from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import DeliveryDetailsList from './DeliveryDetailsList';
import ButtonListItem from '../../../../components/List/ButtonListItem';

const DeliveryListItem = props => {
    const [deliveryOpen, setDeliveryOpen] = useState(false);
    const handleDeliveryClick = () => {
        setDeliveryOpen(!deliveryOpen);
    };
    return (
        <Fragment>
            <ButtonListItem onClick={handleDeliveryClick}>
                <ListItemText
                    primary="Dostawa"
                />
                {deliveryOpen ? <ExpandLess/> : <ExpandMore/>}
            </ButtonListItem>
            <Collapse in={deliveryOpen} timeout="auto" unmountOnExit>
                <DeliveryDetailsList {...props} />
            </Collapse>
        </Fragment>
    );
};

export default DeliveryListItem;
