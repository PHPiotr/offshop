import {combineReducers} from 'redux';
import auth from './auth';
import buyer from './buyer';
import buyerDelivery from './buyerDelivery';
import cart from './cart';
import checkout from './checkout';
import order from './order';
import categories from './categories';
import product from './product';
import products from './products';
import suppliers from './suppliers';
import notification from './notification';
import dialog from './dialog';
import form from './form';

export default combineReducers({
    auth,
    buyer,
    buyerDelivery,
    cart,
    categories,
    checkout,
    dialog,
    form,
    notification,
    order,
    product,
    products,
    suppliers,
});
