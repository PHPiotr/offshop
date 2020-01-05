import React from 'react';
import {createStore, combineReducers} from 'redux';
import Order from '../Order';
import order from '../../reducers/order';

let store;

describe('Order', () => {

    beforeEach(() => {
        store = createStore(
            combineReducers({
                order,
            }),
        );
    });

    it('should render order page', async () => {
        const {getByText} = await renderWithStore(<Order/>, store);
        expect(getByText('Dziękujemy za zamówienie')).toBeDefined();
    });

});
