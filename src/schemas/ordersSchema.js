import {schema} from 'normalizr';

export const order = new schema.Entity('orders', {}, {
    idAttribute: 'extOrderId',
});
export const orderList = [order];
