import { combineReducers } from 'redux';
import buyer from './buyer';
import buyerDelivery from './buyerDelivery';
import cart from './cart';
import checkout from './checkout';
import order from './order';
import categories from './categories';
import product from './product';
import products from './products';
import suppliers from './suppliers';
import addedToCartDialog from './addedToCartDialog';
import { reducer as form } from'redux-form';
import {CREATE_PRODUCT_SUCCESS} from '../actions/product';

export default combineReducers({
    buyer,
    buyerDelivery,
    cart,
    checkout,
    order,
    categories,
    product,
    products,
    suppliers,
    addedToCartDialog,
    form: form.plugin({
        product: (state, action) => {
            switch(action.type) {
                case '@@redux-form/FOCUS':
                    if (action.meta.field === 'price' && /\d+\.\d{2}/.test(state.values.price)) {
                        return {
                            ...state,
                            values: {
                                ...state.values,
                                price: state.values.price ? state.values.price.substring(0, state.values.price.indexOf('.')) : state.values.price,
                            },
                        };
                    }
                    return state;
                case '@@redux-form/BLUR':
                    if (action.meta.field === 'price' && !/\d+\.\d{2}/.test(action.payload)) {
                        return {
                            ...state,
                            values: {
                                ...state.values,
                                price: state.values.price ? state.values.price += '.00' : state.values.price,
                            },
                        };
                    }
                    return state;
                case CREATE_PRODUCT_SUCCESS:
                    return undefined;
                default:
                    return state;
            }
        }
    })
});
