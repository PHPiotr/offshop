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
                case CREATE_PRODUCT_SUCCESS:
                    return undefined;
                default:
                    return state;
            }
        }
    })
});
