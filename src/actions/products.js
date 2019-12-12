import {normalize} from 'normalizr';
import * as productSchema from '../schemas/productsSchema';
import {getRequestPublic} from '../api';

export const RETRIEVE_PRODUCTS_REQUEST = 'RETRIEVE_PRODUCTS_REQUEST';
export const RETRIEVE_PRODUCTS_SUCCESS = 'RETRIEVE_PRODUCTS_SUCCESS';
export const RETRIEVE_PRODUCTS_FAILURE = 'RETRIEVE_PRODUCTS_FAILURE';
export const SYNC_QUANTITIES = 'SYNC_QUANTITIES';
export const ON_CREATE_PRODUCT = 'ON_CREATE_PRODUCT';
export const ON_UPDATE_PRODUCT = 'ON_UPDATE_PRODUCT';
export const ON_DELETE_PRODUCT = 'ON_DELETE_PRODUCT';

export const getProductsIfNeeded = params => {
    return async (dispatch, getState) => {
        const {products: {isFetching, data, ids}} = getState();
        if (isFetching) {
            return Promise.resolve();
        }

        dispatch({type: RETRIEVE_PRODUCTS_REQUEST});
        try {
            const response = await getRequestPublic('/products', params);
            const payload = normalize(response.data, productSchema.productList);
            if (params.skip > 0) {
                dispatch({type: RETRIEVE_PRODUCTS_SUCCESS, payload: {
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
                dispatch({type: RETRIEVE_PRODUCTS_SUCCESS, payload});
            }
            return payload;
        } catch (error) {
            dispatch({type: RETRIEVE_PRODUCTS_FAILURE, payload: {error}});
            return error;
        }
    };
};

export const syncQuantities = (productsIds, productsById) => ({type: SYNC_QUANTITIES, payload: {productsIds, productsById}});
export const onCreateProduct = (product, sort, order) => ({type: ON_CREATE_PRODUCT, payload: {product, sort, order}});
export const onUpdateProduct = (product, sort, order) => ({type: ON_UPDATE_PRODUCT, payload: {product, sort, order}});
export const onDeleteProduct = (product) => ({type: ON_DELETE_PRODUCT, payload: {product}});
