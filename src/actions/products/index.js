import {normalize} from 'normalizr';
import * as productSchema from '../../schemas/productsSchema';
import {getProducts} from "../../api/products";

export const RETRIEVE_PRODUCTS_REQUEST = 'RETRIEVE_PRODUCTS_REQUEST';
export const RETRIEVE_PRODUCTS_SUCCESS = 'RETRIEVE_PRODUCTS_SUCCESS';
export const RETRIEVE_PRODUCTS_FAILURE = 'RETRIEVE_PRODUCTS_FAILURE';

export const getProductsIfNeeded = params => {
    return async (dispatch, getState) => {
        const {products} = getState();
        if (products.ids.length) {
            return;
        }

        dispatch({type: RETRIEVE_PRODUCTS_REQUEST});
        try {
            const response = await getProducts();
            if (!response.ok) {
                throw Error(response.errorMessage);
            }
            const items = await response.json();
            const payload = normalize(items, productSchema.productList);
            dispatch({type: RETRIEVE_PRODUCTS_SUCCESS, payload});

            return Promise.resolve(payload);
        } catch (error) {
            dispatch({type: RETRIEVE_PRODUCTS_FAILURE});
            return Promise.reject(error);
        }
    };
};

export const retrieveProductsSuccess = items => ({type: RETRIEVE_PRODUCTS_SUCCESS, payload: {items}});