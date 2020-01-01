import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import ProductsView from '../components/Products';
import {getProductsIfNeeded, onCreateProduct, onDeleteProduct, onUpdateProduct} from '../actions/products';
import {showNotification} from '../actions/notification';
import useInfiniteScrolling from '../hooks/useInfiniteScrolling';

const Products = props => {

    const {
        getProductsIfNeeded,
        onCreateProduct,
        onUpdateProduct,
        onDeleteProduct,
        showNotification,
        socket,
    } = props;
    const [sort, setSort] = useState('name');
    const [order, setOrder] = useState(1);
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
        if (!socket) {
            return;
        }
        socket.on('createProduct', onCreateProductListener);
        socket.on('updateProduct', onUpdateProductListener);
        socket.on('deleteProduct', onDeleteProductListener);
        return () => {
            socket.off('createProduct', onCreateProductListener);
            socket.off('updateProduct', onUpdateProductListener);
            socket.off('deleteProduct', onDeleteProductListener);
        }
    }, []);

    return <ProductsView />;
};

const mapDispatchToProps = {
    getProductsIfNeeded,
    showNotification,
    onCreateProduct,
    onUpdateProduct,
    onDeleteProduct,
};

export default connect(null, mapDispatchToProps)(Products);
