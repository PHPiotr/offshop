import {combineReducers} from 'redux';
import auth from './auth';
import buyer from './buyer';
import buyerDelivery from './buyerDelivery';
import deliveryMethods from './deliveryMethods';
import cart from './cart';
import checkout from './checkout';
import order from './order';
import categories from './categories';
import product from './product';
import products from './products';
import adminProducts from './admin/products';
import adminProduct from './admin/product';
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
    deliveryMethods,
    dialog,
    form,
    notification,
    order,
    product,
    products,
    adminProduct,
    adminProducts,
});
