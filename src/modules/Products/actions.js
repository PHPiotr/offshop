import {normalize} from 'normalizr';
import * as actions from './actionTypes';
import * as productSchema from './schema';
import {
    deleteRequestPrivate,
    getRequestPrivate,
    getRequestPublic,
    postRequestPrivate,
    putRequestPrivate,
} from '../../api';

export const getProductIfNeeded = slug => async (dispatch) => {
    dispatch({type: actions.RETRIEVE_PRODUCT_REQUEST});
    try {
        const response = await getRequestPublic(`/products/${slug}`);
        const { data } = response;
        const payload = normalize(data, productSchema.product);
        dispatch({type: actions.RETRIEVE_PRODUCT_SUCCESS, payload});
    } catch (error) {
        dispatch({type: actions.RETRIEVE_PRODUCT_FAILURE, payload: {error}});
        throw error;
    }
};

export const getProductsIfNeeded = params => {
    return async (dispatch, getState) => {
        const {products: {data, ids, isFetching}} = getState();
        if (isFetching) {
            return;
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
        }
    };
};

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

export const onDeleteCurrentProduct = product => ({
    type: actions.ON_DELETE_CURRENT_PRODUCT,
    payload: {product},
});

export const onUpdateCurrentProduct = product => ({
    type: actions.ON_UPDATE_CURRENT_PRODUCT,
    payload: {product},
});


export const getAdminProductsIfNeeded = params => {
    return async (dispatch, getState) => {
        const {adminProducts: {data, ids}, auth: {accessToken}} = getState();
        dispatch({type: actions.RETRIEVE_ADMIN_PRODUCTS_REQUEST});
        try {
            const response = await getRequestPrivate(accessToken)('/admin/products', params);
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
        }
    };
};

export const deleteProductIfNeeded = productId => {
    return async (dispatch, getState) => {
        const {auth: {accessToken}, adminProducts: {ids}} = getState();
        try {
            dispatch({type: actions.DELETE_PRODUCT_REQUEST, payload: {productId}});
            await deleteRequestPrivate(accessToken)(`/admin/products/${productId}`);
            dispatch({type: actions.DELETE_PRODUCT_SUCCESS});
        } catch (error) {
            dispatch({type: actions.DELETE_PRODUCT_FAILURE, payload: {ids}});
            throw error;
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
        const {data} = await postRequestPrivate(accessToken)('/admin/products', {}, fd, {'Content-Type': 'multipart/form-data'});
        const payload = normalize(data, productSchema.product);
        dispatch({type: actions.CREATE_PRODUCT_SUCCESS, payload});
    } catch (error) {
        dispatch({type: actions.CREATE_PRODUCT_FAILURE, payload: {error}});
        throw error;
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
        const {data} = await putRequestPrivate(accessToken)(`/admin/products/${id}`, {}, fd, {'Content-Type': 'multipart/form-data'});
        const payload = normalize(data, productSchema.product);
        dispatch({type: actions.UPDATE_PRODUCT_SUCCESS, payload});
    } catch (error) {
        dispatch({type: actions.UPDATE_PRODUCT_FAILURE, payload: {error}});
        throw error;
    }
};

export const getAdminProductIfNeeded = productId => {
    return async (dispatch, getState) => {
        const {auth: {accessToken}} = getState();
        dispatch({type: actions.RETRIEVE_ADMIN_PRODUCT_REQUEST});
        try {
            const response = await getRequestPrivate(accessToken)(`/admin/products/${productId}`);
            const {data} = response;
            const payload = normalize(data, productSchema.product);
            dispatch({type: actions.RETRIEVE_ADMIN_PRODUCT_SUCCESS, payload});
        } catch (error) {
            dispatch({type: actions.RETRIEVE_ADMIN_PRODUCT_FAILURE, payload: {error}});
            throw error;
        }
    };
};

export const resetAdminProduct = () => ({type: actions.RESET_ADMIN_PRODUCT});
