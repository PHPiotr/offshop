import { combineReducers } from 'redux';
import cart from './cart';
import checkout from './checkout';
import categories from './categories';
import products from './products';
import suppliers from './suppliers';
import addedToCartDialog from './addedToCartDialog';
import shipping from './shipping';

export default combineReducers({
    cart,
    checkout,
    categories,
    products,
    suppliers,
    addedToCartDialog,
    shipping,
});
