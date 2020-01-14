import React, {Fragment, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import ProductsInCart from './ProductsInCart';
import CartSummary from './CartSummary';
import EmptyCart from './EmptyCart';
import {onUpdateProductInCart, onDeleteProductInCart} from '../actions';
import {showNotification} from '../../../actions/notification';
import {getDeliveryMethodsIfNeeded} from '../../Delivery/actions';

const ShoppingCart = props => {

    const {
        getDeliveryMethodsIfNeeded,
        products,
        onUpdateProductInCart,
        onDeleteProductInCart,
        showNotification,
        socket,
    } = props;
    const [sort] = useState('name');
    const [order] = useState(1);

    const onUpdateProductListener = payload => {
        const {product} = payload;
        const productInCart = products.find(i => i.id === product.id);
        if (productInCart) {
            if (product.active && product.stock) {
                onUpdateProductInCart(product);
                showNotification({
                    message: `Produkt ${product.name} został zmieniony.`,
                    variant: 'warning',
                });
            } else {
                onDeleteProductInCart(product);
                showNotification({
                    message: `Produkt ${product.name} został usunięty.`,
                    variant: 'warning',
                });
            }
        }
    };
    const onDeleteProductListener = payload => {
        const {product} = payload;
        const productInCart = products.find(i => i.id === product.id);
        if (productInCart) {
            onDeleteProductInCart(product);
            showNotification({
                message: `Produkt ${product.name} został usunięty.`,
                variant: 'warning',
            });
        }
    };

    useEffect(() => {
        if (props.products.length > 0) {
            getDeliveryMethodsIfNeeded({sort, order});
        }
    }, []);

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.on('updateProduct', onUpdateProductListener);
        socket.on('deleteProduct', onDeleteProductListener);

        return () => {
            socket.off('updateProduct', onUpdateProductListener);
            socket.off('deleteProduct', onDeleteProductListener);
        };
    }, []);

    if (!props.products.length) {
        return <EmptyCart/>;
    }

    return (
        <Fragment>
            <ProductsInCart/>
            <CartSummary socket={socket}/>
        </Fragment>
    );
};

const mapStateToProps = state => ({
    products: state.cart.ids.map(i => state.products.data[i]),
});

const mapDispatchToProps = {
    getDeliveryMethodsIfNeeded,
    onUpdateProductInCart,
    onDeleteProductInCart,
    showNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart);
