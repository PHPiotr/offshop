import {schema} from 'normalizr';

export const deliveryMethod = new schema.Entity('deliveryMethods', {}, {
    idAttribute: 'id',
});
export const deliveryMethodList = [deliveryMethod];
