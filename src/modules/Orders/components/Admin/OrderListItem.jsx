import React, {Fragment, useState} from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import OrderDetailsList from './OrderDetailsList';
import ButtonListItem from '../../../../components/List/ButtonListItem';

const OrderListItem = ({order}) => {
    const [orderOpen, setOrderOpen] = useState(false);
    const handleOrderClick = () => {
        setOrderOpen(!orderOpen);
    };
    return (
        <Fragment>
            <ButtonListItem onClick={handleOrderClick}>
                <ListItemText
                    primary="Szczegóły"
                />
                {orderOpen ? <ExpandLess/> : <ExpandMore/>}
            </ButtonListItem>
            <Collapse in={orderOpen} timeout="auto" unmountOnExit>
                <OrderDetailsList order={order} />
            </Collapse>
        </Fragment>
    );
};

export default OrderListItem;
