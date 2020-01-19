import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {addToCart} from '../../../modules/ShoppingCart/actions';
import {openDialog} from '../../../actions/dialog';
import {showNotification} from '../../../actions/notification';
import {getProductIfNeeded, resetProductData, onDeleteCurrentProduct, onUpdateCurrentProduct} from '../actions';
import ProductView from './ProductView';
import RequestHandler from '../../../components/RequestHandler';
import SocketContext from '../../../contexts/SocketContext';

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

    const socket = useContext(SocketContext);
    const {getProductIfNeeded, product} = props;
    const [slug, setSlug] = useState(props.match.params.slug);

    const onUpdateProductListener = payload => {
        const {wasActive, isActive} = payload;
        const productFromPayload = payload.product;
        if (wasActive) {
            if (isActive) {
                if (productFromPayload.id === product.id) {
                    props.showNotification({
                        message: `Produkt ${productFromPayload.name} został zmieniony.`,
                        variant: 'warning',
                    });
                    props.onUpdateCurrentProduct(productFromPayload);
                    if (productFromPayload.slug !== product.slug) {
                        props.history.replace(`/products/${productFromPayload.slug}`);
                    }
                }
            } else {
                if (productFromPayload.id === product.id) {
                    props.showNotification({
                        message: `Produkt ${productFromPayload.name} został usunięty.`,
                        variant: 'warning',
                    });
                    props.onUpdateCurrentProduct(productFromPayload);
                }
            }
        } else {
            if (isActive) {
                if (productFromPayload.id === product.id || productFromPayload.slug === slug) {
                    props.showNotification({
                        message: `Produkt ${productFromPayload.name} został dodany.`,
                        variant: 'warning',
                    });
                    props.onUpdateCurrentProduct(productFromPayload);
                    if (productFromPayload.slug !== product.slug) {
                        props.history.replace(`/products/${productFromPayload.slug}`);
                        setSlug(productFromPayload.slug);
                    }
                }
            }
        }
    };

    const onDeleteProductListener = payload => {
        const {wasActive} = payload;
        const productFromPayload = payload.product;
        if (wasActive && productFromPayload.id === product.id) {
            props.showNotification({
                message: `Produkt ${productFromPayload.name} został usunięty.`,
                variant: 'warning',
            });
            props.onDeleteCurrentProduct(productFromPayload);
        }
    };

    useEffect(() => {
        socket.on('updateProduct', onUpdateProductListener);
        socket.on('deleteProduct', onDeleteProductListener);
        return () => {
            socket.off('updateProduct', onUpdateProductListener);
            socket.off('deleteProduct', onDeleteProductListener);
        }
    });

    return (
        <RequestHandler action={() => getProductIfNeeded(slug)} deps={[props.productId]}>
            <ProductView />
        </RequestHandler>
    );
};

const mapStateToProps = state => ({
    productId: state.product.id,
});
const mapDispatchToProps = {
    getProductIfNeeded,
    resetProductData,
    addToCart,
    openDialog,
    onDeleteCurrentProduct,
    onUpdateCurrentProduct,
    showNotification,
};

Product.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Product)));
