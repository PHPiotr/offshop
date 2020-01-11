import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import pink from '@material-ui/core/colors/pink';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import {connect} from 'react-redux';
import {Helmet} from 'react-helmet';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {addToCart} from '../../../modules/ShoppingCart/actions';
import {openDialog} from '../../../actions/dialog';
import ProductAddedToCartDialog from './ProductAddedToCartDialog';

const styles = theme => ({
    card: {
        minWidth: '100%',
        maxWidth: `800px`,
        margin: '0 auto',
        boxShadow: 'none',
    },
    media: {
        height: 0,
        paddingTop: '75%', // 4:3
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: pink[500],
    },
    addToCart: {
        color: theme.palette.background.paper,
    },
});

const ProductView = props => {

    const [expanded, setExpanded] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAddToCart = () => {
        props.addToCart(props.product, 1);
        props.openDialog();
    };

    return (
        <Fragment>
            <Helmet>
                <title>{props.product.name}</title>
                <meta name="description" content={props.product.description}/>
            </Helmet>
            <Card className={props.classes.card}>
                <CardHeader
                    avatar={
                        <Avatar aria-label={props.product.name} className={props.classes.avatar}>
                            {(props.productInCart.quantity || 0) < (props.product.stock || 0) && (
                                <IconButton
                                    data-testid={`add-to-cart-button-${props.product.id}`}
                                    id={props.product.id}
                                    onClick={handleAddToCart}
                                    className={props.classes.addToCart}
                                    disabled={props.productInCart.quantity >= props.product.stock}
                                >
                                    <AddShoppingCartIcon/>
                                </IconButton>
                            )}
                        </Avatar>
                    }
                    action={
                        <IconButton
                            onClick={handleClick}
                            aria-owns={anchorEl ? 'more-menu' : undefined}
                            aria-haspopup="true"
                        >
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={props.product.name}
                    subheader={`${(props.product.unitPrice / 100).toFixed(2)} zł`}
                />
                <Menu id="more-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                    <MenuItem onClick={handleClose}>{`Waga: ${(props.product.weight / 100).toFixed(2)} kg`}</MenuItem>
                    <MenuItem onClick={handleClose}>{`Dostępnść: ${props.product.stock} szt.`}</MenuItem>
                </Menu>
                {props.product.images && <CardMedia
                    className={props.classes.media}
                    image={`${process.env.REACT_APP_PRODUCT_PATH}/${props.product.images[0].card}`}
                    title={props.product.name}
                />}
                <CardContent>
                    <Typography component="p">
                        {props.product.description}
                    </Typography>
                </CardContent>
                <CardActions className={props.classes.actions}>
                    {props.product.longDescription && (
                        <IconButton
                            className={classnames(props.classes.expand, {
                                [props.classes.expandOpen]: expanded,
                            })}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="Show more"
                        >
                            <ExpandMoreIcon/>
                        </IconButton>
                    )}
                </CardActions>
                {props.product.longDescription && (
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Typography paragraph>
                                {props.product.longDescription}
                            </Typography>
                        </CardContent>
                    </Collapse>
                )}
            </Card>
            <ProductAddedToCartDialog />
        </Fragment>
    );
};

const mapStateToProps = state => ({
    product: state.product.data[state.product.id] || {},
    isFetching: state.product.isFetching,
    productInCart: state.cart.products[state.product.id] || {},
});
const mapDispatchToProps = {addToCart, openDialog};

ProductView.propTypes = {
    classes: PropTypes.object.isRequired,
    product: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    productInCart: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ProductView));
