import React, {Fragment, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import CartProducts from '../components/Cart/Products';
import CartSummary from '../components/Cart/Summary';
import {getDeliveryMethodsIfNeeded} from '../actions/deliveryMethods';
import {onUpdateProductInCart, onDeleteProductInCart} from '../actions/cart';
import {showNotification} from '../actions/notification';
import EmptyCart from '../components/Cart/Empty';

const Cart = props => {

    const {
        getDeliveryMethodsIfNeeded,
        products,
        onUpdateProductInCart,
        onDeleteProductInCart,
        showNotification,
        socket,
    } = props;
    const [sort, setSort] = useState('name');
    const [order, setOrder] = useState(1);

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
            <CartProducts/>
            <CartSummary/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
