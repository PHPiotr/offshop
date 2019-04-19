import {authorize, orderCreateRequest, orderRetrieveRequest} from "../../api/payu";
import {getFormValues} from 'redux-form';
import {setActiveStepId} from '../checkout';
import {showNotification} from '../notification';

export const RETRIEVE_ORDER_REQUEST = 'RETRIEVE_ORDER_REQUEST';
export const RETRIEVE_ORDER_SUCCESS = 'RETRIEVE_ORDER_SUCCESS';
export const RETRIEVE_ORDER_FAILURE = 'RETRIEVE_ORDER_FAILURE';
export const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST';
export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS';
export const CREATE_ORDER_FAILURE = 'CREATE_ORDER_FAILURE';
export const RESET_ORDER_DATA = 'RESET_ORDER_DATA';

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

export const createOrderIfNeeded = payMethods => {

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
                payMethods,
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

export const handleCreateOrderError = e => {
    return async dispatch => dispatch(showNotification({message: e.message, variant: 'error'}));
};

// const handleCreateOrderRequest = payMethods => {
//     return async dispatch => {
//         debugger;
//         try {
//             const {redirectUri} = await dispatch(createOrderIfNeeded(payMethods));
//             if (redirectUri) {
//                 window.location.href = redirectUri;
//             } else {
//                 dispatch(setActiveStepId(0));
//                 window.location.href = '/order';
//                 //ownProps.history.replace('/order');
//             }
//         } catch (e) {
//             dispatch(setActiveStepId(2));
//             dispatch(showNotification({message: e.message, variant: 'error'}));
//         }
//     };
// };

export const resetOrderData = () => ({type: RESET_ORDER_DATA});
