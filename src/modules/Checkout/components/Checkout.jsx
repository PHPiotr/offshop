import React, {useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import CheckoutSteps from './CheckoutSteps';
import ProgressIndicator from '../../../components/ProgressIndicator';
import {
    setActiveStepId,
    onUpdateProductInCartSummary,
    onDeleteProductInCartSummary,
} from '../actions';
import {resetOrderData} from '../../Orders/actions';
import {showNotification} from '../../../actions/notification';
import SocketContext from '../../../SocketContext';

const Checkout = props => {
    const {
        products,
        resetOrderData,
        onUpdateProductInCartSummary,
        onDeleteProductInCartSummary,
        showNotification,
        order,
        hasProductsInCart,
    } = props;
    const socket = useContext(SocketContext);

    const onUpdateProductListener = ({product}) => {
        const productInCart = products.find(i => i.id === product.id);
        if (productInCart) {
            if (product.active && product.stock) {
                onUpdateProductInCartSummary(product);
                showNotification({
                    message: `Produkt ${product.name} został zmieniony.`,
                    variant: 'warning',
                });
            } else {
                onUpdateProductInCartSummary(product);
                showNotification({
                    message: `Produkt ${product.name} został usunięty.`,
                    variant: 'warning',
                });
            }
        }
    };
    const onDeleteProductListener = ({product}) => {
        const productInCart = products.find(i => i.id === product.id);
        if (productInCart) {
            onDeleteProductInCartSummary(product);
            showNotification({
                message: `Produkt ${product.name} został usunięty.`,
                variant: 'warning',
            });
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

    useEffect(() => {
        if (order.data.extOrderId && !hasProductsInCart) {
            if (order.data.redirectUri) {
                setTimeout(() => window.location.href = order.data.redirectUri, 600);
            } else {
                props.history.replace('/order');
            }
        }
    }, [order.data.extOrderId]);

    useEffect(() => {
        if (hasProductsInCart) {
            resetOrderData();
        } else {
            props.history.replace('/');
        }
    }, []);

    if (order.isCreating || !hasProductsInCart) {
        return <ProgressIndicator/>;
    }

    return <CheckoutSteps />;
};

const mapStateToProps = state => ({
    products: state.cart.ids.map(i => state.products.data[i]) || [],
    order: state.order,
    hasProductsInCart: state.cart.ids.length > 0,
});

const mapDispatchToProps = {
    setActiveStepId,
    resetOrderData,
    onUpdateProductInCartSummary,
    onDeleteProductInCartSummary,
    showNotification,
};

Checkout.propTypes = {
    order: PropTypes.shape({
        data: PropTypes.object,
        isCreating: PropTypes.bool,
    }).isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Checkout));
