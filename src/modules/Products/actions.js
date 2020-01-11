import {normalize} from 'normalizr';
import * as actions from './actionTypes';
import * as productSchema from './schema';
import {getRequestPublic} from '../../api';
import {createProduct, deleteProduct, getAdminProduct, getAdminProducts, updateProduct} from '../../modules/Products/api';

export const getProductIfNeeded = slug => async (dispatch, getState) => {
    const {product: {isFetching}} = getState();

    if (isFetching) {
        return Promise.resolve();
    }

    dispatch({type: actions.RETRIEVE_PRODUCT_REQUEST});
    try {
        const response = await getRequestPublic(`/products/${slug}`);
        const { data } = response;
        const payload = normalize(data, productSchema.product);
        dispatch({type: actions.RETRIEVE_PRODUCT_SUCCESS, payload});
        return response;
    } catch (error) {
        dispatch({type: actions.RETRIEVE_PRODUCT_FAILURE, payload: {error}});
        return error.response;
    }
};

export const getProductsIfNeeded = params => {
    return async (dispatch, getState) => {
        const {products: {isFetching, data, ids}} = getState();
        if (isFetching) {
            return Promise.resolve();
        }

        dispatch({type: actions.RETRIEVE_PRODUCTS_REQUEST});
        try {
            const response = await getRequestPublic('/products', params);
            const payload = normalize(response.data, productSchema.productList);
            if (params.skip > 0) {
                dispatch({
                    type: actions.RETRIEVE_PRODUCTS_SUCCESS, payload: {
                        entities: {
                            products: {
                                ...data,
                                ...payload.entities.products,
                            }
                        },
                        result: [...ids, ...payload.result],
                    },
                });
            } else {
                dispatch({type: actions.RETRIEVE_PRODUCTS_SUCCESS, payload});
            }
            return payload;
        } catch (error) {
            dispatch({type: actions.RETRIEVE_PRODUCTS_FAILURE, payload: {error}});
            return error;
        }
    };
};

export const syncQuantities = (productsIds, productsById) => ({
    type: actions.SYNC_QUANTITIES,
    payload: {productsIds, productsById}
});

export const onCreateProduct = (product, sort, order) => ({
    type: actions.ON_CREATE_PRODUCT,
    payload: {product, sort, order}
});

export const onUpdateProduct = (product, sort, order) => ({
    type: actions.ON_UPDATE_PRODUCT,
    payload: {product, sort, order}
});

export const onDeleteProduct = (product) => ({
    type: actions.ON_DELETE_PRODUCT,
    payload: {product},
});

export const resetProductData = () => ({
    type: actions.RESET_PRODUCT_DATA,
});

export const onDeleteCurrentProduct = product => ({
    type: actions.ON_DELETE_CURRENT_PRODUCT,
    payload: {product},
});

export const onUpdateCurrentProduct = product => ({
    type: actions.ON_UPDATE_CURRENT_PRODUCT,
    payload: {product},
});


export const getAdminProductsIfNeeded = (params = {}) => {
    return async (dispatch, getState) => {
        const {adminProducts: {isFetching, data, ids}, auth: {accessToken}} = getState();
        if (isFetching) {
            return Promise.resolve();
        }

        dispatch({type: actions.RETRIEVE_ADMIN_PRODUCTS_REQUEST});
        try {
            const response = await getAdminProducts(params, accessToken);
            const payload = normalize(response.data, productSchema.productList);
            if (params.skip > 0) {
                dispatch({
                    type: actions.RETRIEVE_ADMIN_PRODUCTS_SUCCESS,
                    payload: {
                        entities: {
                            products: {
                                ...data,
                                ...payload.entities.products,
                            }
                        },
                        result: [...ids, ...payload.result],
                    },
                });
            } else {
                dispatch({type: actions.RETRIEVE_ADMIN_PRODUCTS_SUCCESS, payload});
            }
            return payload;
        } catch (error) {
            dispatch({type: actions.RETRIEVE_ADMIN_PRODUCTS_FAILURE, payload: {error}});
            return error;
        }
    };
};

export const deleteProductIfNeeded = productId => {
    return async (dispatch, getState) => {
        const {auth: {accessToken}, adminProducts: {ids}} = getState();
        try {
            dispatch({type: actions.DELETE_PRODUCT_REQUEST, payload: {productId}});

            await deleteProduct(productId, accessToken);

            dispatch({type: actions.DELETE_PRODUCT_SUCCESS});

            return Promise.resolve(productId);
        } catch (error) {
            dispatch({type: actions.DELETE_PRODUCT_FAILURE, payload: {error, ids}});

            return Promise.reject(error);
        }
    };
};

export const createProductIfNeeded = (formProps, accessToken) => async dispatch => {
    dispatch({type: actions.CREATE_PRODUCT_REQUEST});
    const fd = new FormData();
    fd.append('img', formProps.img.file);
    fd.append('description', formProps.description);
    fd.append('longDescription', formProps.longDescription);
    fd.append('name', formProps.name);
    fd.append('unitPrice', formProps.unitPrice * 1000 / 10);
    fd.append('stock', formProps.stock);
    fd.append('weight', formProps.weight * 1000 / 10);
    fd.append('active', formProps.active);

    try {
        const response = await createProduct(fd, accessToken);
        const {status, data} = response;
        if (status === 201) {
            const payload = normalize(data, productSchema.product);
            dispatch({type: actions.CREATE_PRODUCT_SUCCESS, payload});
        } else {
            dispatch({type: actions.CREATE_PRODUCT_FAILURE, payload: {error: data}});
        }
        return response;
    } catch (error) {
        dispatch({type: actions.CREATE_PRODUCT_FAILURE, payload: {error}});
        return error;
    }
};

export const updateProductIfNeeded = (formProps, accessToken) => async (dispatch, getState) => {

    const {adminProduct: {id}} = getState();

    dispatch({type: actions.UPDATE_PRODUCT_REQUEST});
    const fd = new FormData();
    if (formProps.img) {
        fd.append('img', formProps.img.file);
    }
    fd.append('name', formProps.name);
    fd.append('description', formProps.description);
    fd.append('longDescription', formProps.longDescription);
    fd.append('unitPrice', formProps.unitPrice * 1000 / 10);
    fd.append('stock', formProps.stock);
    fd.append('weight', formProps.weight * 1000 / 10);
    fd.append('active', formProps.active);

    try {
        const response = await updateProduct(id, fd, accessToken);
        const {status, data} = response;
        if (status === 200) {
            const payload = normalize(data, productSchema.product);
            dispatch({type: actions.UPDATE_PRODUCT_SUCCESS, payload});
        } else {
            dispatch({type: actions.UPDATE_PRODUCT_FAILURE, payload: {error: data}});
        }
        return response;
    } catch (error) {
        dispatch({type: actions.UPDATE_PRODUCT_FAILURE, payload: {error}});
        return error;
    }
};

export const getAdminProductIfNeeded = productId => {
    return async (dispatch, getState) => {
        const {adminProducts: {isFetching}, auth: {accessToken}} = getState();
        if (isFetching) {
            return;
        }

        dispatch({type: actions.RETRIEVE_ADMIN_PRODUCT_REQUEST});
        try {
            const response = await getAdminProduct(productId, accessToken);
            const {data} = response;
            const payload = normalize(data, productSchema.product);
            dispatch({type: actions.RETRIEVE_ADMIN_PRODUCT_SUCCESS, payload});

            return response;
        } catch (error) {
            dispatch({type: actions.RETRIEVE_ADMIN_PRODUCT_FAILURE, payload: {error}});

            return error.response;
        }
    };
};

export const resetAdminProduct = () => ({type: actions.RESET_ADMIN_PRODUCT});
