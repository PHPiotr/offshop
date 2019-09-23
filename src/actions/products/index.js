import {normalize} from 'normalizr';
import * as productSchema from '../../schemas/productsSchema';
import {getProducts} from "../../api/products";

export const RETRIEVE_PRODUCTS_REQUEST = 'RETRIEVE_PRODUCTS_REQUEST';
export const RETRIEVE_PRODUCTS_SUCCESS = 'RETRIEVE_PRODUCTS_SUCCESS';
export const RETRIEVE_PRODUCTS_FAILURE = 'RETRIEVE_PRODUCTS_FAILURE';
export const SYNC_QUANTITIES = 'SYNC_QUANTITIES';
export const ON_CREATE_PRODUCT = 'ON_CREATE_PRODUCT';
export const ON_UPDATE_PRODUCT = 'ON_UPDATE_PRODUCT';
export const ON_DELETE_PRODUCT = 'ON_DELETE_PRODUCT';

export const getProductsIfNeeded = params => {
    return async (dispatch, getState) => {
        const {products: {isFetching}} = getState();
        if (isFetching) {
            return Promise.resolve();
        }

        dispatch({type: RETRIEVE_PRODUCTS_REQUEST});
        try {
            const response = await getProducts(params);
            const {data} = response;
            const payload = normalize(data, productSchema.productList);
            dispatch({type: RETRIEVE_PRODUCTS_SUCCESS, payload});

            return response;
        } catch (error) {
            dispatch({type: RETRIEVE_PRODUCTS_FAILURE, payload: {error}});
            return error.response;
        }
    };
};

export const syncQuantities = (productsIds, productsById) => ({type: SYNC_QUANTITIES, payload: {productsIds, productsById}});
export const onCreateProduct = (product) => ({type: ON_CREATE_PRODUCT, payload: {product}});
export const onUpdateProduct = (product) => ({type: ON_UPDATE_PRODUCT, payload: {product}});
export const onDeleteProduct = (product) => ({type: ON_DELETE_PRODUCT, payload: {product}});
