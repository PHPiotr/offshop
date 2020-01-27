import React from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import {waitForElement} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {adminOrder} from '../../reducer';
import auth from '../../../../modules/Auth/reducer';
import dialog from '../../../../reducers/dialog';
import notification from '../../../../reducers/notification';
import Order from '../../components/Admin/Order';
import NotificationBar from '../../../../components/NotificationBar';

const mock = new MockAdapter(axios);
let store;

const orderPayload = {
    extOrderId: "5e149a3e8f62305337b7c8a2",
    orderCreateDate: "2020-01-07T14:48:30.113Z",
    status: "PENDING",
    totalAmount: "90200",
    id: "5e149a3e8f62305337b7c8a3",
    refund: {
        refundId: 'foo',
        status: 'bar',
    },
    products: [
        {
            id: "5da476864f651730df445456",
            name: "Aaron Reese",
            slug: "aaron-reese",
            unitPrice: "45100",
            quantity: 1,
        }
    ],
    productsIds: ["5da476864f651730df445456"],
    buyer: {
        email: "piet.kowalski@gmail.com",
        phone: "07417416889",
        firstName: "Piotr",
        lastName: "Kowalski",
        language: "pl",
        delivery: {
            street: "foo",
            postalCode: "bar",
            city: "baz",
            recipientName: "fizz",
            countryCode: "PL",
        },
    },
    deliveryMethod: {
        active: true,
        name: "Kurier",
        unitPrice: "1999",
        createdAt: "2019-03-05T01:01:30.486Z",
        updatedAt: "2019-10-10T21:23:01.106Z",
        slug: "kurier",
        id: "5c7dca6a0c37236da9232f9d",
    },
};

describe('Admin/Order', () => {

    beforeEach(() => {
        fakeLocalStorage();
        mock.reset();
        store = createStore(
            combineReducers({adminOrder, auth, dialog, notification}),
            applyMiddleware(thunk),
        );
        mock.onGet(/admin\/orders/).reply(200, orderPayload);
    });

    it('should render admin order page', async () => {
        const {getByText} = await renderWithStore(<Order match={{params: {id: orderPayload.extOrderId}}}/>, store);
        expect(await waitForElement(() => getByText(`Zamówienie ${orderPayload.extOrderId}`))).toBeDefined();
    });

});