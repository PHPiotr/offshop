import React, {useContext, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import ProductsList from './ProductsList';
import {getProductsIfNeeded, onCreateProduct, onDeleteProduct, onUpdateProduct} from '../actions';
import {showNotification} from '../../../actions/notification';
import useInfiniteScrolling from '../../../hooks/useInfiniteScrolling';
import SocketContext from '../../../SocketContext';

const Products = props => {

    const {
        getProductsIfNeeded,
        onCreateProduct,
        onUpdateProduct,
        onDeleteProduct,
        showNotification,
    } = props;
    const [sort] = useState('name');
    const [order] = useState(1);
    const socket = useContext(SocketContext);
    useInfiniteScrolling({
        sort,
        order,
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

export default connect(null, mapDispatchToProps)(Products);
