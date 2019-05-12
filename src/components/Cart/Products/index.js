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
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import {connect} from 'react-redux';
import {addToCart, decrementInCart, deleteFromCart} from "../../../actions/cart";

const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    textField: {
        marginLeft: 0,
        marginRight: 0,
        width: '45px',
        textAlign: 'center',
        borderRadius: 0,
        padding: 0,
    },
});

const getItemById = (items, itemId) => items.find(({_id}) => _id === itemId);

const ProductsInCart = props => {
    const {classes, cart, products} = props;

    const handleIncrementItemInCart = e =>
        props.incrementItemInCart(getItemById(products, e.currentTarget.id));
    const handleDecrementItemInCart = e =>
        props.decrementItemInCart(getItemById(products, e.currentTarget.id));
    const handleRemoveItemFromCart = e =>
        props.removeItemFromCart(e.currentTarget.id);

    return (
        <List className={classes.root}>
            {products.map(p => {

                const productInCart = cart.products[p._id];
                return (
                    <Fragment key={p._id}>
                        <ListItem key={p._id} alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar src={`${process.env.REACT_APP_PRODUCT_PATH}/${p.id}.avatar.jpg`} alt={p.name}/>
                            </ListItemAvatar>
                            <ListItemText
                                primary={p.name}
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            component="span"
                                            className={classes.inline}
                                            color="textPrimary"
                                        >
                                            {`${(p.unitPrice * productInCart.quantity).toFixed(2)} zł`}
                                        </Typography>
                                        {productInCart.quantity > 1 && ` (${p.unitPrice} zł / szt.)`}
                                    </React.Fragment>
                                }
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    id={p._id}
                                    onClick={handleIncrementItemInCart}
                                    disabled={p.stock - productInCart.quantity <= 0}
                                >
                                    <AddShoppingCartIcon/>
                                </IconButton>
                                <TextField
                                    id={p._id}
                                    className={classes.textField}
                                    value={productInCart.quantity}
                                    helperText={`z ${p.stock} szt.`}
                                    margin="none"
                                    type="number"
                                />
                                <IconButton
                                    id={p._id}
                                    onClick={handleDecrementItemInCart}
                                    disabled={productInCart.quantity < 2}
                                >
                                    <RemoveShoppingCartIcon/>
                                </IconButton>
                                <IconButton
                                    id={p._id}
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
    products: state.cart.ids.map(i => state.products.data[i]),
});

const mapDispatchToProps = dispatch => ({
    incrementItemInCart(item) {
        dispatch(addToCart(item));
    },
    decrementItemInCart(item) {
        dispatch(decrementInCart(item));
    },
    removeItemFromCart(itemId) {
        dispatch(deleteFromCart(itemId));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProductsInCart));
