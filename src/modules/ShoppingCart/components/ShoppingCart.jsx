import React, {Fragment, useContext, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import ProductsInCart from './ProductsInCart';
import CartSummary from './CartSummary';
import Empty from '../../../components/Empty';
import {onUpdateProductInCart, onDeleteProductInCart} from '../actions';
import {showNotification} from '../../../actions/notification';
import {getDeliveryMethodsIfNeeded} from '../../Delivery/actions';
import SocketContext from '../../../contexts/SocketContext';
import ErrorPage from '../../../components/ErrorPage';

const ShoppingCart = props => {

    const {
        getDeliveryMethodsIfNeeded,
        products,
        onUpdateProductInCart,
        onDeleteProductInCart,
        showNotification,
    } = props;
    const [sort] = useState('name');
    const [order] = useState(1);
    const socket = useContext(SocketContext);

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
        socket.on('updateProduct', onUpdateProductListener);
        socket.on('deleteProduct', onDeleteProductListener);

        return () => {
            socket.off('updateProduct', onUpdateProductListener);
            socket.off('deleteProduct', onDeleteProductListener);
        };
    }, []);

    if (props.error) {
        return <ErrorPage message={props.error.message}/>;
    }

    if (!props.products.length) {
        return <Empty label="Pusty koszyk" linkLabel="Wróć do strony głównej." linkTo="/" />;
    }

    return (
        <Fragment>
            <ProductsInCart/>
            <CartSummary/>
        </Fragment>
    );
};

const mapStateToProps = state => ({
    products: state.cart.ids.map(i => state.products.data[i]),
    error: state.deliveryMethods.error,
});

const mapDispatchToProps = {
    getDeliveryMethodsIfNeeded,
    onUpdateProductInCart,
    onDeleteProductInCart,
    showNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart);
