import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton/IconButton";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';

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

function AlignItemsList(props) {
    const {classes, products, addOneToCart, removeOneFromCart, removeItemFromCart} = props;

    const handleRemoveAllFromCart = e => removeItemFromCart(e, products.find(p => p.id === e.currentTarget.id).inCart);

    return (
        <List className={classes.root}>
            {products.map(p => (
                <Fragment key={p.id}>
                    <ListItem key={p.id} alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar src={require(`../../../images/${p.img}`)} alt={p.title}/>
                        </ListItemAvatar>
                        <ListItemText
                            primary={p.title}
                            secondary={
                                <React.Fragment>
                                    <Typography component="span" className={classes.inline} color="textPrimary">
                                        {`${p.price * p.inCart} zł`}
                                    </Typography>
                                    {` (${p.price} zł / szt.)`}
                                </React.Fragment>
                            }
                        />
                        <ListItemSecondaryAction>
                            <IconButton id={p.id} onClick={addOneToCart} disabled={!p.amount}>
                                <AddShoppingCartIcon/>
                            </IconButton>
                            <TextField
                                id={p.id}
                                className={classes.textField}
                                value={p.inCart}
                                helperText={`z ${p.inCart + p.amount} szt.`}
                                margin="none"
                                type="number"
                            />
                            <IconButton id={p.id} onClick={removeOneFromCart} disabled={p.inCart < 2}>
                                <RemoveShoppingCartIcon/>
                            </IconButton>
                            <IconButton id={p.id} onClick={handleRemoveAllFromCart}>
                                <DeleteIcon/>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider/>
                </Fragment>
            ))}
        </List>
    );
}

AlignItemsList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AlignItemsList);
