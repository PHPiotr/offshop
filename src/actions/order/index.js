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

        const {order: {isCreating}} = getState();

        if (isCreating) {
            return Promise.resolve();
        }

        dispatch({type: CREATE_ORDER_REQUEST});

        try {
            const authResponse = await authorize();
            const authData = await authResponse.json();
            if (!authResponse.ok) {
                throw new Error(authData.errorMessage);
            }

            const state = getState();
            const { access_token } = authData;
            const { paymentMethodData } = paymentDataFromGooglePay;

            const totalAmount = state.cart.totalPrice + parseInt(state.deliveryMethods.data[state.deliveryMethods.currentId].unitPrice.replace('.', ''), 10) * state.cart.quantity;
            const products = state.cart.ids.reduce((acc, _id) => {
                const {name, unitPrice} = state.products.data[_id];
                acc[_id] = {
                    _id,
                    name,
                    unitPrice: unitPrice.replace('.', ''),
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
                payMethods: {
                    payMethod: {
                        value: process.env.REACT_APP_PAYU_METHOD_VALUE_GOOGLE_PAY,
                        type: process.env.REACT_APP_PAYU_METHOD_TYPE_GOOGLE_PAY,
                        authorizationCode: btoa(paymentMethodData.tokenizationData.token),
                    }
                },
                accessToken: access_token,
                totalAmount: totalAmount.toFixed(),
                productsIds: state.cart.ids,
                products,
                description: 'OFFSHOP - transakcja',
                buyer,
            });
            const orderData = await orderResponse.json();
            if (!orderResponse.ok) {
                throw new Error(orderData.message);
            }
            dispatch({type: CREATE_ORDER_SUCCESS, payload: {orderData}});

            return Promise.resolve(orderData);

        } catch (orderError) {
            dispatch({type: CREATE_ORDER_FAILURE});

            return Promise.reject(orderError);
        }
    }
};

export const createOrderPayuExpress = payuExpressData => {

    return async (dispatch, getState) => {

        const {order: {isCreating}} = getState();

        if (isCreating) {
            return Promise.resolve();
        }

        dispatch({type: CREATE_ORDER_REQUEST});

        try {
            const authResponse = await authorize();
            const authData = await authResponse.json();
            if (!authResponse.ok) {
                throw new Error(authData.errorMessage);
            }

            const state = getState();
            const { access_token } = authData;

            const totalAmount = state.cart.totalPrice + parseInt(state.deliveryMethods.data[state.deliveryMethods.currentId].unitPrice.replace('.', ''), 10) * state.cart.quantity;
            const products = state.cart.ids.reduce((acc, _id) => {
                const {name, unitPrice} = state.products.data[_id];
                acc[_id] = {
                    _id,
                    name,
                    unitPrice: unitPrice.replace('.', ''),
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
                payMethods: {
                    payMethod: {
                        value: payuExpressData.value,
                        type: payuExpressData.type,
                    }
                },
                accessToken: access_token,
                totalAmount: totalAmount.toFixed(),
                productsIds: state.cart.ids,
                products,
                description: 'OFFSHOP - transakcja',
                buyer,
            });
            const orderData = await orderResponse.json();
            if (!orderResponse.ok) {
                throw new Error(orderData.message);
            }
            dispatch({type: CREATE_ORDER_SUCCESS, payload: {orderData}});

            return Promise.resolve(orderData);

        } catch (orderError) {
            dispatch({type: CREATE_ORDER_FAILURE});

            return Promise.reject(orderError);
        }
    }
};