import {schema} from 'normalizr';

export const product = new schema.Entity('products', {}, {
    idAttribute: 'id',
});
export const productList = [product];
