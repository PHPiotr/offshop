import {authorize, orderCreateRequest} from "../../api/payu";
import {getFormValues} from 'redux-form';
import {showNotification} from '../notification';

export const RETRIEVE_ORDER_REQUEST = 'RETRIEVE_ORDER_REQUEST';
export const RETRIEVE_ORDER_SUCCESS = 'RETRIEVE_ORDER_SUCCESS';
export const RETRIEVE_ORDER_FAILURE = 'RETRIEVE_ORDER_FAILURE';
export const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST';
export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS';
export const CREATE_ORDER_FAILURE = 'CREATE_ORDER_FAILURE';
export const RESET_ORDER_DATA = 'RESET_ORDER_DATA';

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

            const productsById = state.cart.ids.reduce((acc, id) => {
                const {name, slug, unitPrice} = state.products.data[id];
                acc[id] = {
                    id,
                    name,
                    slug,
                    unitPrice,
                    quantity: state.cart.products[id].quantity,
                };
                return acc;
            }, {});

            const buyer =  getFormValues('buyer')(state);
            buyer.language = process.env.REACT_APP_BUYER_LANGUAGE;
            const delivery = getFormValues('buyerDelivery')(state);
            if (delivery) {
                buyer.delivery = delivery;
                buyer.delivery.countryCode = 'PL';
            }

            const {data} = await orderCreateRequest({
                payMethods,
                accessToken: access_token,
                totalAmount: state.cart.totalPriceWithDelivery,
                totalWithoutDelivery: state.cart.totalPrice,
                totalWeight: state.cart.weight,
                productsIds: state.cart.ids,
                productsById,
                description: 'OFFSHOP - transakcja',
                buyer,
                deliveryMethod: state.deliveryMethods.data[state.deliveryMethods.currentId],
            });

            dispatch({type: CREATE_ORDER_SUCCESS, payload: {orderData: data}});

            return Promise.resolve(data);

        } catch (e) {
            dispatch({type: CREATE_ORDER_FAILURE, payload: {
                orderError: (e.response && e.response.data && e.response.data.message) || e.message || 'Something went wrong'}});

            return Promise.reject(e);
        }
    }
};

export const handleCreateOrderError = e => showNotification({message: (e.response && e.response.data && e.response.data.message) || e.message || 'Something went wrong', variant: 'error'});

export const resetOrderData = () => ({type: RESET_ORDER_DATA});
