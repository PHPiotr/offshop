import { combineReducers } from 'redux';
import buyer from './buyer';
import cart from './cart';
import checkout from './checkout';
import order from './order';
import categories from './categories';
import products from './products';
import suppliers from './suppliers';
import addedToCartDialog from './addedToCartDialog';
import shipping from './shipping';

export default combineReducers({
    buyer,
    cart,
    checkout,
    order,
    categories,
    products,
    suppliers,
    addedToCartDialog,
    shipping,
});
