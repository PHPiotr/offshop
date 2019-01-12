import {authorize, orderCreateRequest, orderRetrieveRequest} from "../../api/payu";

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

            const totalPrice = state.cart.totalPrice + state.suppliers.data[state.suppliers.currentId].pricePerUnit * state.cart.units;
            const totalAmount = parseFloat(totalPrice).toFixed(2).toString().replace('.', '');
            const description = `${paymentMethodData.description}`;
            const products = state.cart.ids.map(i => {
                const {name, price, inCart} = state.products.data[i];
                return {
                    name,
                    unitPrice: parseFloat(price).toFixed(2).toString().replace('.', ''),
                    quantity: inCart.toString(),
                };
            });
            const buyer = state.buyer.ids.reduce((acc, i) => {
                const {value} = state.buyer.data[i];
                if (value.trim()) {
                    acc[i] = value;
                }
                return acc;
            }, {});
            const buyerDelivery = state.buyerDelivery.ids.reduce((acc, i) => {
                acc[i] = state.buyerDelivery.data[i].value;
                return acc;
            }, {});

            const orderResponse = await orderCreateRequest({
                accessToken: access_token,
                authorizationCode,
                totalAmount,
                products,
                description,
                buyer,
                buyerDelivery,
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