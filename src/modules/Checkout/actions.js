import {getFormValues} from 'redux-form';
import {authorize} from "../../api/payu";
import {showNotification} from '../../actions/notification';
import * as actions from './actionTypes';
import {CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, CREATE_ORDER_FAILURE} from '../Orders/actionTypes';
import {ON_DELETE_PRODUCT, ON_UPDATE_PRODUCT} from '../Products/actionTypes';
import {postRequestPrivate} from '../../api';

export const stepNext = () => ({type: actions.STEP_NEXT});

export const stepBack = () => ({type: actions.STEP_BACK});

export const setActiveStepId = activeStepId => ({
    type: actions.SET_ACTIVE_STEP_ID,
    payload: {activeStepId},
});

export const onUpdateProductInCartSummary = product => ({
    type: ON_UPDATE_PRODUCT,
    payload: {product},
});

export const onDeleteProductInCartSummary = product => ({
    type: ON_DELETE_PRODUCT,
    payload: {product},
});

export const createOrderIfNeeded = payMethods => {

    return async (dispatch, getState) => {
        dispatch({type: CREATE_ORDER_REQUEST});
        try {
            const {data: {access_token: accessToken}} = await authorize();
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

            const {data} = await postRequestPrivate(accessToken)('/orders', {}, {
                buyer,
                continueUrl: process.env.REACT_APP_PAYU_CONTINUE_URL,
                currencyCode: process.env.REACT_APP_CURRENCY_CODE,
                deliveryMethod: state.deliveryMethods.data[state.deliveryMethods.currentId],
                description: 'OFFSHOP - transakcja',
                merchantPosId: process.env.REACT_APP_GOOGLE_PAY_TOKENIZATION_GATEWAY_MERCHANT_ID,
                notifyUrl: `${process.env.REACT_APP_API_HOST}${process.env.REACT_APP_PAYU_NOTIFY_PATH}`,
                payMethods,
                productsById,
                productsIds: state.cart.ids,
                settings: {invoiceDisabled: true},
                totalAmount: state.cart.totalPriceWithDelivery,
                totalWeight: state.cart.weight,
                totalWithoutDelivery: state.cart.totalPrice,
            });
            dispatch({type: CREATE_ORDER_SUCCESS, payload: {orderData: data}});
        } catch (error) {
            dispatch({type: CREATE_ORDER_FAILURE, payload: {error}});
            throw error;
        }
    }
};

export const handleCreateOrderError = e => showNotification({
    message: e.message,
    variant: 'error',
});
