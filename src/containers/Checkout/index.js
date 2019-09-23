import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import CheckoutView from '../../components/Checkout';
import {connect} from 'react-redux';
import ProgressIndicator from '../../components/ProgressIndicator';
import {
    setActiveStepId,
    onUpdateProductInCartSummary,
    onDeleteProductInCartSummary,
} from '../../actions/checkout';
import {resetOrderData} from '../../actions/order';
import io from '../../io';
import {showNotification} from '../../actions/notification';
const socket = io();

const Checkout = props => {
    const {
        products,
        setActiveStepId,
        resetOrderData,
        onUpdateProductInCartSummary,
        onDeleteProductInCartSummary,
        showNotification,
    } = props;

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
        if (props.order.data.extOrderId) {
            if (props.order.data.redirectUri) {
                window.location.href = props.order.data.redirectUri;
            } else {
                resetOrderData();
                setActiveStepId(0);
                props.history.replace('/order');
            }
        }
        if (!props.hasProductsInCart) {
            props.history.replace('/');
        }
    }, []);

    return (
        <Fragment>
            {props.order.isCreating && <ProgressIndicator/>}
            <CheckoutView />
        </Fragment>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
