import {combineReducers} from 'redux';
import appBar from './appBar';
import auth from './auth';
import {cart} from '../modules/ShoppingCart/reducer';
import {checkout, buyer, buyerDelivery} from '../modules/Checkout/reducer';
import {product, products, adminProduct, adminProducts} from '../modules/Products/reducer';
import {deliveryMethods, adminDeliveryMethod, adminDeliveryMethods} from '../modules/Delivery/reducer';
import {order, adminOrder, adminOrders} from '../modules/Orders/reducer';
import notification from './notification';
import dialog from './dialog';
import form from './form';

export default combineReducers({
    adminProduct,
    adminProducts,
    adminDeliveryMethod,
    adminDeliveryMethods,
    adminOrder,
    adminOrders,
    appBar,
    auth,
    buyer,
    buyerDelivery,
    cart,
    checkout,
    deliveryMethods,
    dialog,
    form,
    notification,
    order,
    product,
    products,
});
