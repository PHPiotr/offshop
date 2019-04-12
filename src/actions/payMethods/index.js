import {normalize} from 'normalizr';
import * as payMethodsSchema from '../../schemas/payMethodsSchema';
import {getPayMethods} from '../../api/payMethods';

export const RETRIEVE_PAY_METHODS_REQUEST = 'RETRIEVE_PAY_METHODS_REQUEST';
export const RETRIEVE_PAY_METHODS_SUCCESS = 'RETRIEVE_PAY_METHODS_SUCCESS';
export const RETRIEVE_PAY_METHODS_FAILURE = 'RETRIEVE_PAY_METHODS_FAILURE';

export const getPayMethodsIfNeeded = params => {
    return async (dispatch, getState) => {
        const {payMethods: {isFetching}} = getState();
        if (isFetching) {
            Promise.resolve();
        }

        dispatch({type: RETRIEVE_PAY_METHODS_REQUEST});
        try {
            const response = await getPayMethods();
            if (!response.ok) {
                throw Error(response.errorMessage);
            }
            const items = await response.json();
            const payload = normalize(items, payMethodsSchema.payMethodList);
            dispatch({type: RETRIEVE_PAY_METHODS_SUCCESS, payload});

            return Promise.resolve(payload);
        } catch (error) {
            dispatch({type: RETRIEVE_PAY_METHODS_FAILURE, payload: {error}});
            return Promise.reject(error);
        }
    };
};
