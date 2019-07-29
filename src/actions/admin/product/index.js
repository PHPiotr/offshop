import {createProduct, getAdminProduct, updateProduct} from '../../../api/products';
import {normalize} from 'normalizr';
import * as productSchema from '../../../schemas/productsSchema';

export const RETRIEVE_ADMIN_PRODUCT_REQUEST = 'RETRIEVE_ADMIN_PRODUCT_REQUEST';
export const RETRIEVE_ADMIN_PRODUCT_SUCCESS = 'RETRIEVE_ADMIN_PRODUCT_SUCCESS';
export const RETRIEVE_ADMIN_PRODUCT_FAILURE = 'RETRIEVE_ADMIN_PRODUCT_FAILURE';

export const CREATE_PRODUCT_REQUEST = 'CREATE_PRODUCT_REQUEST';
export const CREATE_PRODUCT_SUCCESS = 'CREATE_PRODUCT_SUCCESS';
export const CREATE_PRODUCT_FAILURE = 'CREATE_PRODUCT_FAILURE';

export const UPDATE_PRODUCT_REQUEST = 'UPDATE_PRODUCT_REQUEST';
export const UPDATE_PRODUCT_SUCCESS = 'UPDATE_PRODUCT_SUCCESS';
export const UPDATE_PRODUCT_FAILURE = 'UPDATE_PRODUCT_FAILURE';

export const createProductIfNeeded = (formProps, accessToken) => async dispatch => {
    dispatch({type: CREATE_PRODUCT_REQUEST});
    const fd = new FormData();
    fd.append('img', formProps.img.file);
    fd.append('slug', formProps.slug);
    fd.append('description', formProps.description);
    fd.append('longDescription', formProps.longDescription);
    fd.append('name', formProps.name);
    fd.append('unitPrice', formProps.unitPrice * 1000 / 10);
    fd.append('stock', formProps.stock);
    fd.append('weight', formProps.weight * 1000 / 10);
    fd.append('active', formProps.active);

    try {
        const {data} = await createProduct(fd, accessToken);
        const payload = normalize(data, productSchema.product);
        dispatch({type: CREATE_PRODUCT_SUCCESS, payload});
        return payload;
    } catch (error) {
        dispatch({type: CREATE_PRODUCT_FAILURE});
        return error;
    }
};

export const updateProductIfNeeded = (formProps, accessToken) => async (dispatch, getState) => {

    const {adminProduct: {id}} = getState();

    dispatch({type: UPDATE_PRODUCT_REQUEST});
    const fd = new FormData();
    if (formProps.img) {
        fd.append('img', formProps.img.file);
    }
    fd.append('name', formProps.name);
    fd.append('slug', formProps.slug);
    fd.append('description', formProps.description);
    fd.append('longDescription', formProps.longDescription);
    fd.append('unitPrice', formProps.unitPrice * 1000 / 10);
    fd.append('stock', formProps.stock);
    fd.append('weight', formProps.weight * 1000 / 10);
    fd.append('active', formProps.active);

    try {
        const {data} = await updateProduct(id, fd, accessToken);
        const payload = normalize(data, productSchema.product);
        dispatch({type: UPDATE_PRODUCT_SUCCESS, payload});
        return payload;
    } catch (error) {
        dispatch({type: UPDATE_PRODUCT_FAILURE});
        return error;
    }
};

export const getAdminProductIfNeeded = productId => {
    return async (dispatch, getState) => {
        const {adminProducts: {isFetching}, auth: {accessToken}} = getState();
        if (isFetching) {
            return;
        }

        dispatch({type: RETRIEVE_ADMIN_PRODUCT_REQUEST});
        try {
            const {data} = await getAdminProduct(productId, accessToken);
            const payload = normalize(data, productSchema.product);
            dispatch({type: RETRIEVE_ADMIN_PRODUCT_SUCCESS, payload});

            return payload;
        } catch (error) {
            dispatch({type: RETRIEVE_ADMIN_PRODUCT_FAILURE, payload: {error}});

            return error;
        }
    };
};