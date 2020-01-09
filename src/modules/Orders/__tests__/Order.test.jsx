import React from 'react';
import {createStore, combineReducers} from 'redux';
import Order from '../components/Order';
import {order} from '../reducer';

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
