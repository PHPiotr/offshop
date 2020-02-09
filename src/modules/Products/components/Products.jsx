import React, {useContext, useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import queryString from 'query-string';
import ProductsList from './ProductsList';
import {getProductsIfNeeded, onCreateProduct, onDeleteProduct, onUpdateProduct} from '../actions';
import {showNotification} from '../../../actions/notification';
import useInfiniteScrolling from '../../../hooks/useInfiniteScrolling';
import SocketContext from '../../../contexts/SocketContext';

const Products = props => {

    const {
        getProductsIfNeeded,
        onCreateProduct,
        onUpdateProduct,
        onDeleteProduct,
        showNotification,
    } = props;
    const socket = useContext(SocketContext);
    const {sort = 'name', order = '1', ...rest} = queryString.parse(props.location.search);
    useInfiniteScrolling({
        sort,
        order,
        ...rest,
        getItems: getProductsIfNeeded,
    });

    const onCreateProductListener = ({product, isActive}) => {
        if (isActive) {
            onCreateProduct(product, sort, order);
            showNotification({
                message: `Produkt ${product.name} został dodany.`,
                variant: 'success',
            });
        }
    };

    const onUpdateProductListener = ({product, wasActive, isActive}) => {
        if (wasActive) {
            onUpdateProduct(product, sort, order);
            if (isActive) {
                showNotification({
                    message: `Produkt ${product.name} został zmieniony.`,
                    variant: 'warning',
                });
            } else {
                showNotification({
                    message: `Produkt ${product.name} został usunięty.`,
                    variant: 'warning',
                });
            }
        } else {
            if (isActive) {
                onUpdateProduct(product, sort, order);
                showNotification({
                    message: `Produkt ${product.name} został dodany.`,
                    variant: 'warning',
                });
            }
        }
    };

    const onDeleteProductListener = ({product, wasActive}) => {
        if (wasActive) {
            onDeleteProduct(product);
            showNotification({
                message: `Produkt ${product.name} został usunięty.`,
                variant: 'warning',
            });
        }
    };

    useEffect(() => {
        socket.on('createProduct', onCreateProductListener);
        socket.on('updateProduct', onUpdateProductListener);
        socket.on('deleteProduct', onDeleteProductListener);
        return () => {
            socket.off('createProduct', onCreateProductListener);
            socket.off('updateProduct', onUpdateProductListener);
            socket.off('deleteProduct', onDeleteProductListener);
        }
    }, []);

    return <ProductsList />;
};

const mapDispatchToProps = {
    getProductsIfNeeded,
    showNotification,
    onCreateProduct,
    onUpdateProduct,
    onDeleteProduct,
};

export default withRouter(connect(null, mapDispatchToProps)(Products));
