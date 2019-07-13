import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';
import {connect} from 'react-redux';
import {getProductIfNeeded, resetProductData} from '../actions/product';
import {addToCart} from '../actions/cart';
import {openDialog} from '../actions/dialog';
import ProgressIndicator from '../components/ProgressIndicator';
import ProductView from '../components/Product';

const styles = theme => ({
    card: {
        maxWidth: `800px`,
        margin: '0 auto',
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

const Product = props => {

    useEffect(() => {
        props.getProductIfNeeded(props.match.params.slug);
        return props.resetProductData;
    }, [props.match.params.slug]);

    if (props.isFetching) {
        return <ProgressIndicator/>;
    }

    return <ProductView />;
};

const mapStateToProps = state => ({
    product: state.product.data[state.product.id] || {},
    isFetching: state.product.isFetching,
    productInCart: state.cart.products[state.product.id] || {},
});
const mapDispatchToProps = {getProductIfNeeded, resetProductData, addToCart, openDialog};

Product.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Product));
