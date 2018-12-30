import { combineReducers } from 'redux';
import buyer from './buyer';
import buyerDelivery from './buyerDelivery';
import cart from './cart';
import checkout from './checkout';
import order from './order';
import categories from './categories';
import products from './products';
import suppliers from './suppliers';
import addedToCartDialog from './addedToCartDialog';

export default combineReducers({
    buyer,
    buyerDelivery,
    cart,
    checkout,
    order,
    categories,
    products,
    suppliers,
    addedToCartDialog,
});
