import {createProduct} from '../../api/products';

export const CREATE_PRODUCT_REQUEST = 'CREATE_PRODUCT_REQUEST';
export const CREATE_PRODUCT_SUCCESS = 'CREATE_PRODUCT_SUCCESS';
export const CREATE_PRODUCT_FAILURE = 'CREATE_PRODUCT_FAILURE';

export const createNewProductIfNeeded = (formProps, accessToken) => async dispatch => {
    dispatch(createProductRequest());
    const fd = new FormData();
    fd.append('img', formProps.img.file);
    fd.append('name', formProps.name);
    fd.append('price', formProps.price.toString().replace('.', ''));
    fd.append('quantity', formProps.quantity);
    fd.append('unit', formProps.unit);
    fd.append('unitsPerProduct', formProps.unitsPerProduct);

    try {
        const {ok} = await createProduct(fd, accessToken);
        if (ok) {
            return dispatch(createProductSuccess());
        }
        throw Error;
    } catch (err) {
        await dispatch(createProductFailure());
        return Promise.reject();
    }
};

const createProductRequest = () => ({type: CREATE_PRODUCT_REQUEST});
const createProductSuccess = () => ({type: CREATE_PRODUCT_SUCCESS});
const createProductFailure = () => ({type: CREATE_PRODUCT_FAILURE});
