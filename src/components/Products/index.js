import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import SubHeader from '../SubHeader';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    icon: {
        color: theme.palette.background.paper,
    },
});

function ProductsGridList(props) {
    const {classes, products} = props;

    const handleAddToCart = e => {
        props.addToCart(products.find(p => p.id === e.currentTarget.id), 1);
    };

    return (
        <Fragment>
            <SubHeader content={props.category.title} />
            <GridList cellHeight={`auto`}>
                {products.map(p => (
                        <GridListTile key={p.id}>
                            <img src={require(`../../images/${p.img}`)} alt={p.title}/>
                            <GridListTileBar
                                title={p.title}
                                subtitle={<span>{p.price} zł / szt.<br />Ilość: {p.amount + p.inCart} szt.</span>}
                                actionIcon={
                                    <IconButton id={p.id} className={classes.icon} onClick={handleAddToCart} disabled={!p.amount}>
                                        <AddShoppingCartIcon/>
                                    </IconButton>
                                }
                            />
                        </GridListTile>
                    )
                )}
            </GridList>
        </Fragment>
    );
}

ProductsGridList.propTypes = {
    classes: PropTypes.object.isRequired,
    addToCart: PropTypes.func.isRequired,
    products: PropTypes.array.isRequired,
};

export default withStyles(styles)(ProductsGridList);
