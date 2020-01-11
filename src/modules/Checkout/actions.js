import {getFormValues} from 'redux-form';
import {authorize} from "../../api/payu";
import {orderCreateRequest} from "../../modules/Checkout/api";
import {showNotification} from '../../actions/notification';
import * as actions from './actionTypes';
import {CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, CREATE_ORDER_FAILURE} from '../Orders/actionTypes';

export const stepNext = () => ({type: actions.STEP_NEXT});

export const stepBack = () => ({type: actions.STEP_BACK});

export const setActiveStepId = activeStepId => ({
    type: actions.SET_ACTIVE_STEP_ID,
    payload: {activeStepId},
});

export const onUpdateProductInCartSummary = product => ({
    type: actions.ON_UPDATE_PRODUCT_IN_CART_SUMMARY,
    payload: {product},
});

export const onDeleteProductInCartSummary = product => ({
    type: actions.ON_DELETE_PRODUCT_IN_CART_SUMMARY,
    payload: {product},
});

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

            const buyer = getFormValues('buyer')(state);
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
            dispatch({
                type: CREATE_ORDER_FAILURE, payload: {
                    orderError: (e.response && e.response.data && e.response.data.message) || e.message || 'Something went wrong'
                }
            });

            return Promise.reject(e);
        }
    }
};

export const handleCreateOrderError = e => showNotification({
    message: (e.response && e.response.data && e.response.data.message) || e.message || 'Something went wrong',
    variant: 'error',
});

export const setBuyerInputValue = (name, value) => ({
    type: actions.SET_BUYER_INPUT_VALUE,
    payload: {name, value},
});

