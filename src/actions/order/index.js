import {authorize, orderCreateRequest, orderRetrieveRequest} from "../../api/payu";
import {getFormValues} from 'redux-form';

export const RETRIEVE_ORDER_REQUEST = 'RETRIEVE_ORDER_REQUEST';
export const RETRIEVE_ORDER_SUCCESS = 'RETRIEVE_ORDER_SUCCESS';
export const RETRIEVE_ORDER_FAILURE = 'RETRIEVE_ORDER_FAILURE';
export const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST';
export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS';
export const CREATE_ORDER_FAILURE = 'CREATE_ORDER_FAILURE';

export const retrieveOrder = extOrderId => {

    return async dispatch => {

        dispatch({type: RETRIEVE_ORDER_REQUEST});

        try {
            const authResponse = await authorize();
            const authData = await authResponse.json();
            if (!authResponse.ok) {
                throw Error(authData.errorMessage);
            }
            const { access_token } = authData;

            const orderResponse = await orderRetrieveRequest({accessToken: access_token, extOrderId});
            const orderData = await orderResponse.json();
            if (!orderResponse.ok) {
                throw Error(orderData.errorMessage);
            }
            dispatch({type: RETRIEVE_ORDER_SUCCESS, payload: {orderData}});

            return Promise.resolve(orderData);

        } catch (orderError) {
            dispatch({type: RETRIEVE_ORDER_FAILURE, payload: {orderError}});
            return Promise.reject(orderError);
        }
    };
};

export const createOrder = paymentDataFromGooglePay => {

    return async (dispatch, getState) => {

        dispatch({type: CREATE_ORDER_REQUEST});

        try {
            const authResponse = await authorize();
            const authData = await authResponse.json();
            if (!authResponse.ok) {
                throw Error(authData.errorMessage);
            }

            const state = getState();
            const { access_token } = authData;
            const { paymentMethodData } = paymentDataFromGooglePay;
            const authorizationCode = btoa(paymentMethodData.tokenizationData.token);

            const totalPrice = state.cart.totalPrice + state.deliveryMethods.data[state.deliveryMethods.currentId].unitPrice * state.cart.quantity;
            const totalAmount = parseFloat(totalPrice).toFixed(2).toString().replace('.', '');
            const products = state.cart.ids.reduce((acc, _id) => {
                const {name, price} = state.products.data[_id];
                acc[_id] = {
                    _id,
                    name,
                    unitPrice: parseFloat(price).toFixed(2).toString().replace('.', ''),
                    quantity: state.cart.products[_id].quantity.toString(),
                };
                return acc;
            }, {});

            const buyer =  getFormValues('buyer')(state);
            const delivery = getFormValues('buyerDelivery')(state);
            if (delivery) {
                buyer.delivery = delivery;
                buyer.delivery.countryCode = 'PL';
            }

            const orderResponse = await orderCreateRequest({
                accessToken: access_token,
                authorizationCode,
                totalAmount,
                productsIds: state.cart.ids,
                products,
                description: 'OFFSHOP - transakcja',
                buyer,
            });
            const orderData = await orderResponse.json();
            if (!orderResponse.ok) {
                throw Error(orderData.errorMessage);
            }
            dispatch({type: CREATE_ORDER_SUCCESS, payload: {orderData}});

            return Promise.resolve(orderData);

        } catch (orderError) {
            dispatch({type: CREATE_ORDER_FAILURE, payload: {orderError: orderError.message}});

            return Promise.reject(orderError);
        }
    }
};