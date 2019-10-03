import {normalize} from 'normalizr';
import * as productSchema from '../../schemas/productsSchema';
import {getProduct} from '../../api/products';

export const RETRIEVE_PRODUCT_REQUEST = 'RETRIEVE_PRODUCT_REQUEST';
export const RETRIEVE_PRODUCT_SUCCESS = 'RETRIEVE_PRODUCT_SUCCESS';
export const RETRIEVE_PRODUCT_FAILURE = 'RETRIEVE_PRODUCT_FAILURE';

export const getProductIfNeeded = slug => async (dispatch, getState) => {
    const {product: {isFetching}} = getState();

    if (isFetching) {
        return Promise.resolve();
    }

    dispatch({type: RETRIEVE_PRODUCT_REQUEST});
    try {
        const response = await getProduct(slug);
        const { data } = response;
        const payload = normalize(data, productSchema.product);
        dispatch({type: RETRIEVE_PRODUCT_SUCCESS, payload});
        return response;
    } catch (error) {
        dispatch({type: RETRIEVE_PRODUCT_FAILURE, payload: {error}});
        return error.response;
    }
};

export const RESET_PRODUCT_DATA = 'RESET_PRODUCT_DATA';
export const resetProductData = () => ({type: RESET_PRODUCT_DATA});

export const ON_UPDATE_CURRENT_PRODUCT = 'ON_UPDATE_CURRENT_PRODUCT';
export const ON_DELETE_CURRENT_PRODUCT = 'ON_DELETE_CURRENT_PRODUCT';

export const onDeleteCurrentProduct = product => ({type: ON_DELETE_CURRENT_PRODUCT, payload: {product}});
export const onUpdateCurrentProduct = product => ({type: ON_UPDATE_CURRENT_PRODUCT, payload: {product}});
