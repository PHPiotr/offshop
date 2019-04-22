import {authorize, orderCreateRequest, orderRetrieveRequest} from "../../api/payu";
import {getFormValues} from 'redux-form';
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
            const {data: {access_token}} = await authorize();

            const {data} = await orderRetrieveRequest({accessToken: access_token, extOrderId});
            dispatch({type: RETRIEVE_ORDER_SUCCESS, payload: {orderData: data}});

            return Promise.resolve(data);

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
            const {data: {access_token}} = await authorize();
            const state = getState();

            const totalAmount = state.cart.totalPrice + parseInt(state.deliveryMethods.data[state.deliveryMethods.currentId].unitPrice.replace('.', ''), 10) * state.cart.quantity;
            const products = state.cart.ids.reduce((acc, _id) => {
                const {name, slug, unitPrice} = state.products.data[_id];
                acc[_id] = {
                    _id,
                    name,
                    slug,
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

            const {data} = await orderCreateRequest({
                payMethods,
                accessToken: access_token,
                totalAmount: totalAmount.toFixed(),
                totalWithoutDelivery: state.cart.totalPrice,
                totalWeight: state.cart.weight,
                productsIds: state.cart.ids,
                products,
                description: 'OFFSHOP - transakcja',
                buyer,
                deliveryMethod: state.deliveryMethods.data[state.deliveryMethods.currentId],
            });

            dispatch({type: CREATE_ORDER_SUCCESS, payload: {orderData: data}});

            return Promise.resolve(data);

        } catch (e) {
            dispatch({type: CREATE_ORDER_FAILURE, payload: {orderError: e.message || 'Something went wrong'}});

            return Promise.reject(e);
        }
    }
};

export const handleCreateOrderError = e => showNotification({message: e.message || 'Something went wrong', variant: 'error'});

export const resetOrderData = () => ({type: RESET_ORDER_DATA});
