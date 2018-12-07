import {combineReducers} from 'redux';
import cart from './cart';
import categories from './categories';
import products from './products';
import suppliers from './suppliers';

export default combineReducers({
    cart,
    categories,
    products,
    suppliers,
});
