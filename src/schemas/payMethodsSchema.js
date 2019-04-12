import {schema} from 'normalizr';

export const payMethod = new schema.Entity('payMethods', {}, {
    idAttribute: 'value',
});
export const payMethodList = [payMethod];
