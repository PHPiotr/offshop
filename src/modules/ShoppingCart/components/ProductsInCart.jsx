import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton/IconButton';
import AddShoppingCartIcon from '@material-ui/icons/Add';
import RemoveShoppingCartIcon from '@material-ui/icons/Remove';
import DeleteIcon from '@material-ui/icons/RemoveShoppingCart';
import Divider from '@material-ui/core/Divider';
import {connect} from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import {addToCart, decrementInCart, deleteFromCart} from "../../../modules/ShoppingCart/actions";

const styles = theme => ({
    root: {
        width: '100%',
    },
    listItem: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
    secondaryAction: {
        right: 0,
    },
    inline: {
        display: 'inline',
    },
    textField: {
        lineHeight: '3rem',
    },
});

const getItemById = (items, itemId) => items.find(({id}) => id === itemId);

const ProductsInCart = props => {
    const {classes, cart, products} = props;

    const handleIncrementItemInCart = e =>
        props.incrementItemInCart(getItemById(products, e.currentTarget.id));
    const handleDecrementItemInCart = e =>
        props.decrementItemInCart(getItemById(products, e.currentTarget.id));
    const handleRemoveItemFromCart = e =>
        props.removeItemFromCart(getItemById(products, e.currentTarget.id));

    return (
        <List className={classes.root} disablePadding>
            {products.map(p => {

                const productInCart = cart.products[p.id];
                return (
                    <Fragment key={p.id}>
                        <ListItem key={p.id} alignItems="flex-start" className={classes.listItem}>
                            <ListItemAvatar>
                                <Avatar src={`${process.env.REACT_APP_PRODUCT_PATH}/${p.images[0].avatar}`} alt={p.name}/>
                            </ListItemAvatar>
                            <ListItemText
                                primary={<Link data-testid={`link-${p.id}`} component={RouterLink} to={`/products/${p.slug}`}>{p.name}</Link>}
                                secondary={
                                    <Typography
                                        component="p"
                                        color="textPrimary"
                                    >
                                        {`${(p.unitPrice * productInCart.quantity / 100).toFixed(2)} zł`}
                                    </Typography>
                                }
                            />
                            <ListItemSecondaryAction className={classes.secondaryAction}>
                                <IconButton
                                    data-testid={`increment-${p.id}`}
                                    id={p.id}
                                    onClick={handleIncrementItemInCart}
                                    disabled={p.stock - productInCart.quantity <= 0}
                                >
                                    <AddShoppingCartIcon/>
                                </IconButton>
                                <Typography className={classes.textField} component="span">{productInCart.quantity}</Typography>
                                <IconButton
                                    data-testid={`decrement-${p.id}`}
                                    id={p.id}
                                    onClick={handleDecrementItemInCart}
                                    disabled={productInCart.quantity < 2}
                                >
                                    <RemoveShoppingCartIcon/>
                                </IconButton>
                                <IconButton
                                    data-testid={`remove-${p.id}`}
                                    id={p.id}
                                    onClick={handleRemoveItemFromCart}
                                >
                                    <DeleteIcon/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider/>
                    </Fragment>
                )
            })}
        </List>
    );
};

ProductsInCart.propTypes = {
    classes: PropTypes.object.isRequired,
    products: PropTypes.array.isRequired,
    incrementItemInCart: PropTypes.func.isRequired,
    decrementItemInCart: PropTypes.func.isRequired,
    removeItemFromCart: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    cart: state.cart,
    products: state.cart.ids.map(i => state.products.data[i]) || [],
});

const mapDispatchToProps = dispatch => ({
    incrementItemInCart(item) {
        dispatch(addToCart(item));
    },
    decrementItemInCart(item) {
        dispatch(decrementInCart(item));
    },
    removeItemFromCart(item) {
        dispatch(deleteFromCart(item));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProductsInCart));
