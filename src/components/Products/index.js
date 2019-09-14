import React from 'react';
import PropTypes from 'prop-types';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Grid from '@material-ui/core/Grid';
import {withStyles} from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';

const styles = theme => ({
    gridListTitle: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        margin: '0 auto',
    },
    gridListTileBar: {
        flexGrow: 1,
    },
    iconButton: {
        color: theme.palette.background.paper,
    },
    image: {
        left: 0,
        top: '50%',
        width: '100%',
        height: '100%',
        position: 'relative',
        transform: 'translateY(-50%)',
    },
});

function ProductsGridList(props) {
    const {classes, products, cart} = props;

    const handleAddToCart = e => {
        props.addToCart(products.find(p => p.id === e.currentTarget.id), 1);
    };

    const productsLength = products.length;
    const sm = productsLength >= 2 ? 6 : 12;
    const md = productsLength >= 3 ? 4 : 12 / productsLength;
    const lg = productsLength >= 4 ? 3 : 12 / productsLength;

    return (
        <GridList cellHeight={`auto`}>
            {products.map(product => {

                const productInStockQuantity = product.stock;
                const productInCart = cart.products[product.id] || {quantity: 0};
                const canAddToCart = productInStockQuantity - productInCart.quantity > 0;

                return (
                    <Grid item key={product.id} xs={12} sm={sm} md={md} lg={lg}>
                        <GridListTile className={classes.gridListTitle}>
                            <img
                                src={`${process.env.REACT_APP_PRODUCT_PATH}/${product.id}.tile.jpg?${(new Date()).getTime()}`}
                                alt={product.name}
                                className={classes.image}
                            />
                            <GridListTileBar
                                className={classes.gridListTileBar}
                                title={<Link color="inherit" component={RouterLink} to={`/products/${product.slug}`}>{product.name}</Link>}
                                subtitle={<span>{(product.unitPrice / 100).toFixed(2)} zł</span>}
                                actionIcon={
                                    <IconButton
                                        id={product.id}
                                        className={classes.iconButton}
                                        onClick={handleAddToCart}
                                        style={{display: canAddToCart ? 'block' : 'none'}}
                                    >
                                        <AddShoppingCartIcon/>
                                    </IconButton>
                                }
                            />
                        </GridListTile>
                    </Grid>
                )
            })}
        </GridList>
    );
}

ProductsGridList.propTypes = {
    classes: PropTypes.object.isRequired,
    addToCart: PropTypes.func.isRequired,
    products: PropTypes.array.isRequired,
    cart: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductsGridList);
