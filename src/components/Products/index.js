import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import SubHeader from '../SubHeader';

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
});

function ProductsGridList(props) {
    const { classes, products } = props;

    const handleAddToCart = e => {
        props.addToCart(products.find(p => p.id === e.currentTarget.id), 1);
    };

    return (
        <Fragment>
            <SubHeader content={props.category.title} />
            <GridList cellHeight={`auto`}>
                {products.map(product => (
                    <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                        <GridListTile
                            key={product.id}
                            className={classes.gridListTitle}
                        >
                            <img
                                src={require(`../../../public/images/${
                                    product.img
                                }`)}
                                alt={product.title}
                                className={classes.image}
                            />
                            <GridListTileBar
                                className={classes.gridListTileBar}
                                title={product.title}
                                subtitle={<span>{product.price} zł</span>}
                                actionIcon={
                                    <IconButton
                                        id={product.id}
                                        className={classes.iconButton}
                                        onClick={handleAddToCart}
                                        style={{
                                            display:
                                                product.amount <= 0
                                                    ? 'none'
                                                    : 'block',
                                        }}
                                    >
                                        <AddShoppingCartIcon />
                                    </IconButton>
                                }
                            />
                        </GridListTile>
                    </Grid>
                ))}
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
