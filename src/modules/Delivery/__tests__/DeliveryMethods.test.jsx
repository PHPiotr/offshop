import React from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import DeliveryMethods from '../components/DeliveryMethods';
import NotificationBar from '../../../components/NotificationBar';
import {cart} from '../../../modules/ShoppingCart/reducer';
import notification from '../../../reducers/notification';
import {deliveryMethods} from '../../../modules/Delivery/reducer';

const deliveryMethod = {
    id: "5c7dca6a0c37236da9232f9d",
    name: "Foo",
    slug: "foo",
    unitPrice: "1999",
    createdAt: "2019-03-05T01:01:30.486Z",
    updatedAt: "2019-10-10T21:23:01.106Z",
    active: true,
};

const mock = new MockAdapter(axios);
let store;

describe('DeliveryMethods', () => {

    beforeEach(() => {
        fakeLocalStorage();
        mock.reset();
        store = createStore(
            combineReducers({
                cart,
                deliveryMethods,
                notification,
            }),
            applyMiddleware(thunk),
        );
    });

    describe('event listeners', () => {

        describe('createDelivery', () => {

            const message = `Opcja dostawy ${deliveryMethod.name} została dodana.`;

            it('should show notification message when created delivery method', async () => {
                const {getByText, queryByText} = await renderWithStore(<><DeliveryMethods/><NotificationBar/></>, store);
                expect(queryByText(message)).toBeNull();
                socket.socketClient.emit('createDelivery', {deliveryMethod});
                expect(getByText(message)).toBeDefined();
            });

        });

        describe('updateDelivery', () => {

            const message = `Opcja dostawy ${deliveryMethod.name} została zmieniona.`;

            it('should show updated delivery method notification message when updated delivery method', async () => {
                const {getByText, queryByText} = await renderWithStore(<><DeliveryMethods/><NotificationBar/></>, store);
                expect(queryByText(message)).toBeNull();
                socket.socketClient.emit('updateDelivery', {deliveryMethod});
                expect(getByText(message)).toBeDefined();
            });

        });

        describe('deleteDelivery', () => {

            const message = `Opcja dostawy ${deliveryMethod.name} została usunięta.`;

            it('should show notification message when deleted delivery method', async () => {
                const {getByText, queryByText} = await renderWithStore(<><DeliveryMethods/><NotificationBar/></>, store);
                expect(queryByText(message)).toBeNull();
                socket.socketClient.emit('deleteDelivery', {deliveryMethod});
                expect(getByText(message)).toBeDefined();
            });

        });

    });

});
