import {createProduct} from '../../api/products';

export const CREATE_PRODUCT_REQUEST = 'CREATE_PRODUCT_REQUEST';
export const CREATE_PRODUCT_SUCCESS = 'CREATE_PRODUCT_SUCCESS';
export const CREATE_PRODUCT_FAILURE = 'CREATE_PRODUCT_FAILURE';

export const createNewProductIfNeeded = (formProps, accessToken) => async dispatch => {
    dispatch(createProductRequest());
    const fd = new FormData();
    fd.append('img', formProps.img.file);
    fd.append('name', formProps.name);
    fd.append('unitPrice', formProps.unitPrice * 100);
    fd.append('stock', formProps.stock);
    fd.append('weight', formProps.weight);

    try {
        const response = await createProduct(fd, accessToken);
        if (response.ok) {
            return dispatch(createProductSuccess());
        }
        const {message} = await response.json();
        throw Error(message);
    } catch (error) {
        dispatch(createProductFailure({payload: error}));
        return Promise.reject(error);
    }
};

const createProductRequest = () => ({type: CREATE_PRODUCT_REQUEST});
const createProductSuccess = () => ({type: CREATE_PRODUCT_SUCCESS});
const createProductFailure = () => ({type: CREATE_PRODUCT_FAILURE});
