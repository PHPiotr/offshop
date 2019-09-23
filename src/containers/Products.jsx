import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import ProductsView from '../components/Products';
import {getProductsIfNeeded, onCreateProduct, onDeleteProduct, onUpdateProduct} from '../actions/products';
import RequestHandler from './RequestHandler';
import {showNotification} from '../actions/notification';
import io from '../io';
const socket = io();

const Products = props => {

    const {
        getProductsIfNeeded,
        onCreateProduct,
        onUpdateProduct,
        onDeleteProduct,
        showNotification,
    } = props;
    const [sort, setSort] = useState('name');
    const [order, setOrder] = useState(1);
    const action = () => getProductsIfNeeded({sort, order});

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

    return (
        <RequestHandler action={action}>
            {() => <ProductsView />}
        </RequestHandler>
    );
};

const mapDispatchToProps = {
    getProductsIfNeeded,
    showNotification,
    onCreateProduct,
    onUpdateProduct,
    onDeleteProduct,
};

export default connect(null, mapDispatchToProps)(Products);
