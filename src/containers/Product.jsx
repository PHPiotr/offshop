import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

// actions
import {addToCart} from '../actions/cart';
import {openDialog} from '../actions/dialog';
import {showNotification} from '../actions/notification';
import {getProductIfNeeded, resetProductData} from '../actions/product';
import {onDeleteCurrentProduct, onUpdateCurrentProduct} from '../actions/product';

// components
import ErrorPage from '../components/ErrorPage';
import NotFound from '../components/NotFound';
import ProductView from '../components/Product';
import ProgressIndicator from '../components/ProgressIndicator';

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

    const {getProductIfNeeded, product, socket} = props;

    const [isLoading, setLoading] = useState(false);
    const [response, setResponse] = useState({});
    const [is404, set404] = useState(false);
    const [isError, setIsError] = useState(false);
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
                    set404(true);
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
                    set404(false);
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
            set404(true);
        }
    };

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.on('updateProduct', onUpdateProductListener);
        socket.on('deleteProduct', onDeleteProductListener);
        return () => {
            socket.off('updateProduct', onUpdateProductListener);
            socket.off('deleteProduct', onDeleteProductListener);
        }
    });

    useEffect(() => {
        if (is404) {
            return;
        }
        setIsError(false);
        setLoading(true);
        setResponse({});
        getProductIfNeeded(slug)
            .then(response => {
                setLoading(false);
                setResponse(response);
                set404(!!(response && response.status === 404));
                setIsError(!response || response.status !== 200);
            });
    }, [slug, is404]);
    if (isLoading) {
        return <ProgressIndicator />;
    }
    if (is404) {
        return <NotFound/>
    }
    if (!response) {
        return <ErrorPage status="Błąd sieci" message="Brak odpowiedzi"/>
    }
    if (isError) {
        return <ErrorPage status={`Błąd ${response.status}`} message={response.statusText}/>
    }

    return <ProductView />;
};

const mapStateToProps = state => ({
    //product: state.product.data[state.product.id] || {},
    isFetching: state.product.isFetching,
    productInCart: state.cart.products[state.product.id] || {},
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
