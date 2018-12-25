import {authorize, orderCreateRequest, orderRetrieveRequest} from "../../api/payu";

export const RETRIEVE_ORDER_REQUEST = 'RETRIEVE_ORDER_REQUEST';
export const RETRIEVE_ORDER_SUCCESS = 'RETRIEVE_ORDER_SUCCESS';
export const RETRIEVE_ORDER_FAILURE = 'RETRIEVE_ORDER_FAILURE';
export const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST';
export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS';
export const CREATE_ORDER_FAILURE = 'CREATE_ORDER_FAILURE';

export const setOrderData = orderData => ({type: RETRIEVE_ORDER_SUCCESS, payload: {orderData}});

export const retrieveOrder = extOrderId => {

    return dispatch => {

        dispatch({type: RETRIEVE_ORDER_REQUEST});

        return authorize()
            .then(response => {
                if (!response.ok) {
                    throw Error(response.json());
                }
                return response.json();
            })
            .then(authorizationData => {

                const { access_token } = authorizationData;

                return orderRetrieveRequest({accessToken: access_token, extOrderId})
                    .then(response => {
                        if (!response.ok) {
                            throw Error;
                        }
                        return response.json();
                    }).then(orderData => {
                        dispatch({type: RETRIEVE_ORDER_SUCCESS, payload: {orderData}});
                        return Promise.resolve(orderData);

                    });
            })
            .catch(orderError => {
                dispatch({type: RETRIEVE_ORDER_FAILURE, payload: {orderError}});
                return Promise.reject(orderError);
            });
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

            const totalPrice = state.cart.totalPrice + state.suppliers.current.pricePerUnit * state.cart.units;
            const totalAmount = parseFloat(totalPrice).toFixed(2).toString().replace('.', '');
            const description = `${state.shipping.items.firstName.value} ${state.shipping.items.lastName.value} ${paymentMethodData.description}`;
            const products = state.products.items.reduce((acc, p) => {
                if (p.inCart > 0) {
                    acc.push({
                        name: p.title,
                        unitPrice: parseFloat(p.price).toFixed(2).toString().replace('.', ''),
                        quantity: p.inCart.toString(),
                    });
                }
                return acc;
            }, []);
            const buyer = state.shipping.itemIds.reduce((acc, i) => {
                acc[i] = state.shipping.items[i].value;
                return acc;
            }, {});

            const orderResponse = await orderCreateRequest({
                accessToken: access_token,
                authorizationCode,
                totalAmount,
                products,
                description,
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