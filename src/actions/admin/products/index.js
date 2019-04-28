import {normalize} from 'normalizr';
import * as productSchema from '../../../schemas/productsSchema';
import {deleteProduct, getAdminProducts} from '../../../api/products';

export const RETRIEVE_ADMIN_PRODUCTS_REQUEST = 'RETRIEVE_ADMIN_PRODUCTS_REQUEST';
export const RETRIEVE_ADMIN_PRODUCTS_SUCCESS = 'RETRIEVE_ADMIN_PRODUCTS_SUCCESS';
export const RETRIEVE_ADMIN_PRODUCTS_FAILURE = 'RETRIEVE_ADMIN_PRODUCTS_FAILURE';

export const DELETE_PRODUCT_REQUEST = 'DELETE_PRODUCT_REQUEST';
export const DELETE_PRODUCT_SUCCESS = 'DELETE_PRODUCT_SUCCESS';
export const DELETE_PRODUCT_FAILURE = 'DELETE_PRODUCT_FAILURE';

export const getAdminProductsIfNeeded = (params = {}) => {
    return async (dispatch, getState) => {
        const {adminProducts: {isFetching}, auth: {accessToken}} = getState();
        if (isFetching) {
            return Promise.resolve();
        }

        dispatch({type: RETRIEVE_ADMIN_PRODUCTS_REQUEST});
        try {
            const {data} = await getAdminProducts(params, accessToken);
            const payload = normalize(data, productSchema.productList);
            dispatch({type: RETRIEVE_ADMIN_PRODUCTS_SUCCESS, payload});

            return Promise.resolve(payload);
        } catch (error) {
            dispatch({type: RETRIEVE_ADMIN_PRODUCTS_FAILURE, payload: {error}});

            return Promise.reject(error);
        }
    };
};

export const deleteProductIfNeeded = productId => {
    return async (dispatch, getState) => {
        const {auth: {accessToken}, adminProducts: {ids}} = getState();
        try {
            dispatch({type: DELETE_PRODUCT_REQUEST, payload: {productId}});

            await deleteProduct(productId, accessToken);

            dispatch({type: DELETE_PRODUCT_SUCCESS});

            return Promise.resolve(productId);
        } catch (error) {
            dispatch({type: DELETE_PRODUCT_FAILURE, payload: {error, ids}});

            return Promise.reject(error);
        }
    };
};