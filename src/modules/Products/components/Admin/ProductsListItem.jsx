import React, {Fragment, useState} from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import ProductsDetailsList from './ProductsDetailsList';
import ButtonListItem from '../../../../components/List/ButtonListItem';

const ProductsListItem = props => {
    const [productsOpen, setProductsOpen] = useState(false);
    const handleProductsClick = () => {
        setProductsOpen(!productsOpen);
    };
    return (
        <Fragment>
            <ButtonListItem onClick={handleProductsClick}>
                <ListItemText
                    primary="Produkty"
                />
                {productsOpen ? <ExpandLess/> : <ExpandMore/>}
            </ButtonListItem>
            <Collapse in={productsOpen} timeout="auto" unmountOnExit>
                {productsOpen ? <ProductsDetailsList {...props} /> : null}
            </Collapse>
        </Fragment>
    );
};

export default ProductsListItem;
