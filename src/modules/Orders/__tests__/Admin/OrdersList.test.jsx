import React from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import {waitForElement} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {adminOrders} from '../../reducer';
import auth from '../../../../modules/Auth/reducer';
import dialog from '../../../../reducers/dialog';
import notification from '../../../../reducers/notification';
import OrdersList from '../../components/Admin/OrdersList';
import NotificationBar from '../../../../components/NotificationBar';

const mock = new MockAdapter(axios);
let store;

const orderPayload = {
    extOrderId: "5e149a3e8f62305337b7c8a2",
    orderCreateDate: "2020-01-07T14:48:30.113Z",
    status: "PENDING",
    totalAmount: "90200",
    id: "5e149a3e8f62305337b7c8a3",
};

const ordersPayload = [
    {
        extOrderId: '5e15a4d08f62305337b7c8a6',
        orderCreateDate: '2020-01-08T09:45:52.015Z',
        status: 'PENDING',
        totalAmount: '99073',
        id: '5e15a4d08f62305337b7c8a7',
    },
    {
        extOrderId: '5e149a958f62305337b7c8a4',
        orderCreateDate: '2020-01-07T14:49:57.734Z',
        status: 'COMPLETED',
        totalAmount: '45100',
        id: '5e149a958f62305337b7c8a5',
        refund: {
            status: 'fizz',
        },
    },
];

const refundedOrderPayload = {
    ...ordersPayload[0],
    refund: {
        status: 'buzz',
    },
};

describe('Admin/OrdersList', () => {

    beforeEach(() => {
        fakeLocalStorage();
        mock.reset();
        store = createStore(
            combineReducers({adminOrders, auth, dialog, notification}),
            applyMiddleware(thunk),
        );
        mock.onGet(/admin\/orders/).reply(200, ordersPayload);
    });

    it('should render list of orders', async () => {
        const {getByText} = await renderWithStore(<OrdersList/>, store);
        let i = ordersPayload.length;
        while(--i) {
            const orderElem = await waitForElement(() => getByText(ordersPayload[i].extOrderId));
            expect(orderElem).toBeDefined();
        }
    });

    it('should render error page on retrieve orders failure', async () => {
        mock.onGet(/admin\/orders/).networkError();
        const {getByText} = await renderWithStore(<OrdersList/>, store);
        expect(await waitForElement(() => getByText('Network Error'))).toBeDefined();
    });

    describe('event listeners', () => {

        describe('adminCreateOrder', () => {

            const message = `Nowa transakcja: ${orderPayload.extOrderId} została dodana.`;

            it('should show notification on order create event', async () => {
                const {getByText, queryByText} = await renderWithStore(<><OrdersList/><NotificationBar/></>, store);
                expect(queryByText(message)).toBeNull();
                socket.socketClient.emit('adminCreateOrder', {order: orderPayload});
                expect(getByText(message)).toBeDefined();
            });

        });

        describe('adminUpdateOrder', () => {

            const order = ordersPayload[0];
            const message = `Status transakcji: ${order.extOrderId} został zmieniony.`;

            it('should show notification on order update event', async () => {
                const {getByText, queryByText} = await renderWithStore(<><OrdersList/><NotificationBar/></>, store);
                expect(queryByText(message)).toBeNull();
                socket.socketClient.emit('adminUpdateOrder', {order});
                expect(getByText(message)).toBeDefined();
            });

        });

        describe('adminRefund', () => {

            const message = `Status zwrotu zamówienia ${refundedOrderPayload.extOrderId} został zmieniony na ${refundedOrderPayload.refund.status}.`;

            it('should show notification on order refund event', async () => {
                const {getByText, queryByText} = await renderWithStore(<><OrdersList/><NotificationBar/></>, store);
                expect(queryByText(message)).toBeNull();
                socket.socketClient.emit('adminRefund', {order: refundedOrderPayload});
                expect(getByText(message)).toBeDefined();
            });

        });

    });

});
