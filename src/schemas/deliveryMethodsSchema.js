import {schema} from 'normalizr';

export const deliveryMethod = new schema.Entity('deliveryMethods', {}, {
    idAttribute: '_id',
});
export const deliveryMethodList = [deliveryMethod];
