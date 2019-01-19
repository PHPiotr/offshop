import {schema} from 'normalizr';

export const product = new schema.Entity('products', {}, {
    idAttribute: '_id',
});
export const productList = [product];
