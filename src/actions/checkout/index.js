import {authorize, createOrder} from "../../api/payu";

export const STEP_NEXT = 'STEP_NEXT';
export const STEP_BACK = 'STEP_BACK';
export const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST';
export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS';
export const CREATE_ORDER_FAILURE = 'CREATE_ORDER_FAILURE';

export const stepNext = () => ({ type: STEP_NEXT });
export const stepBack = () => ({ type: STEP_BACK });

export const createOrderPayU = paymentDataFromGooglePay => {

    return (dispatch, getState) => {

        dispatch({type: CREATE_ORDER_REQUEST});

        return authorize()
            .then(response => {
                if (!response.ok) {
                    throw Error(response.json());
                }
                return response.json();
            })
            .then(authorizationData => {

                const state = getState();

                // eslint-disable-next-line no-unused-vars
                const { access_token, expires_in, grant_type, token_type } = authorizationData;

                const { paymentMethodData } = paymentDataFromGooglePay;

                const authorizationCode = btoa(paymentMethodData.tokenizationData.token);

                const totalPrice = state.cart.totalPrice + state.suppliers.current.pricePerUnit * state.cart.units;
                const totalAmount = parseFloat(totalPrice).toFixed(2).toString().replace('.', '');
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

                const description = `${state.shipping.items.firstName.value} ${state.shipping.items.lastName.value} ${paymentMethodData.description}`;

                return createOrder({accessToken: access_token, authorizationCode, totalAmount, products, description, buyer})
                    .then(response => {
                        if (!response.ok) {
                            throw Error(response.json());
                        }
                        return response.json();
                    }).then(orderData => {
                        dispatch({type: CREATE_ORDER_SUCCESS, payload: {orderData}});
                        return Promise.resolve(orderData);

                    });
            })
            .catch(orderError => {
                dispatch({type: CREATE_ORDER_FAILURE, payload: {orderError}});
                return Promise.reject(orderError);
            });
    }
};
