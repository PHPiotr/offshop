import {createProduct} from '../../api/products';

export const CREATE_PRODUCT_REQUEST = 'CREATE_PRODUCT_REQUEST';
export const CREATE_PRODUCT_SUCCESS = 'CREATE_PRODUCT_SUCCESS';
export const CREATE_PRODUCT_FAILURE = 'CREATE_PRODUCT_FAILURE';

export const createNewProductIfNeeded = (formProps, accessToken) => {
    return async (dispatch) => {
        debugger;
        dispatch(() => ({type: CREATE_PRODUCT_REQUEST}));
        debugger;
        const fd = new FormData();
        fd.append('img', formProps.img.file);
        fd.append('name', formProps.name);
        fd.append('price', formProps.price);
        fd.append('quantity', formProps.quantity);
        fd.append('unit', formProps.unit);
        fd.append('unitsPerProduct', formProps.unitsPerProduct);

        const response = await createProduct(fd, accessToken);
        if (!response.ok) {
            dispatch(() => ({type: CREATE_PRODUCT_FAILURE}));
        } else {
            dispatch(() => ({type: CREATE_PRODUCT_SUCCESS}));
        }
    }
};
