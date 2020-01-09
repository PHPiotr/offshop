import React, {Fragment, useState} from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import BuyerDetailsList from './BuyerDetailsList';
import ButtonListItem from '../../../../components/List/ButtonListItem';

const BuyerListItem = ({buyer}) => {
    const [buyerOpen, setBuyerOpen] = useState(false);
    const handleBuyerClick = () => {
        setBuyerOpen(!buyerOpen);
    };
    return (
        <Fragment>
            <ButtonListItem onClick={handleBuyerClick}>
                <ListItemText
                    primary="Kupujący"
                />
                {buyerOpen ? <ExpandLess/> : <ExpandMore/>}
            </ButtonListItem>
            <Collapse in={buyerOpen} timeout="auto" unmountOnExit>
                <BuyerDetailsList buyer={buyer} />
            </Collapse>
        </Fragment>
    );
};

export default BuyerListItem;
