import {combineReducers} from 'redux';
import cart from './cart';
import categories from './categories';
import products from './products';
import supply from './supply';

export default combineReducers({
    cart,
    categories,
    products,
    supply,
});
