import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
});

function TitlebarGridList(props) {
    const {classes, category, products, addToCart} = props;

    return (
        <div className={classes.root}>
            <GridList cellHeight={`auto`} className={classes.gridList}>
                <GridListTile cols={2} style={{height: 'auto'}}>
                    <ListSubheader component="div">{category.title}</ListSubheader>
                </GridListTile>
                {products.map((product) => (
                        <GridListTile key={product.id}>
                            <img src={require(`../../images/${product.img}`)} alt={product.title}/>
                            <GridListTileBar
                                title={product.title}
                                subtitle={<span>{product.price} zł</span>}
                                actionIcon={
                                    <IconButton id={product.id} className={classes.icon} onClick={addToCart} disabled={!product.amount}>
                                        {product.amount ? <AddShoppingCartIcon/> : <RemoveShoppingCartIcon/>}
                                    </IconButton>
                                }
                            />
                        </GridListTile>
                    )
                )}
            </GridList>
        </div>
    );
}

TitlebarGridList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TitlebarGridList);
