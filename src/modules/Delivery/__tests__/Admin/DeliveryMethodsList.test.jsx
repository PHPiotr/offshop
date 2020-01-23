import React from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {waitForElement, fireEvent} from '@testing-library/react';
import DeliveryMethodsList from '../../components/Admin/DeliveryMethodsList';
import {adminDeliveryMethods} from '../../reducer';
import auth from '../../../Auth/reducer';
import NotificationBar from '../../../../components/NotificationBar';
import notification from '../../../../reducers/notification';

const deliveryMethodsPayload = [
    {
        id: "5c7dca6a0c37236da9232f9d",
        name: "Foo",
        slug: "foo",
        unitPrice: "1999",
        createdAt: "2019-03-05T01:01:30.486Z",
        updatedAt: "2019-10-10T21:23:01.106Z",
        active: true,
    },
    {
        id: "5cd6be587732b1ba409678b2",
        name: "Bar",
        slug: "bar",
        unitPrice: "2999",
        createdAt: "2019-05-11T12:21:44.173Z",
        updatedAt: "2019-10-10T21:28:58.547Z",
        active: true,
    },
];

const mock = new MockAdapter(axios);
let store;

describe('Admin/DeliveryMethodsList', () => {

    beforeEach(() => {
        fakeLocalStorage();
        mock.reset();
        store = createStore(
            combineReducers({
                adminDeliveryMethods,
                auth,
                notification,
            }),
            applyMiddleware(thunk),
        );
        mock.onGet(/admin\/delivery-methods/).reply(200, deliveryMethodsPayload);
        mock.onDelete(/admin\/delivery-methods/).reply(204);
    });

    it('should render', async () => {
        const {getByText, getByTestId} = await renderWithStore(<><DeliveryMethodsList /><NotificationBar/></>, store);
        let i = deliveryMethodsPayload.length;
        while (--i) {
            const currentItem = deliveryMethodsPayload[i];
            const deliveryMethodElement = await waitForElement(() => getByText(currentItem.name));
            expect(deliveryMethodElement).toBeDefined();
            const deleteBtn = await waitForElement(() => getByTestId(`delete-btn-${currentItem.id}`));
            fireEvent.click(deleteBtn);
            const confirmDeleteBtn = getByText('Tak');
            fireEvent.click(confirmDeleteBtn);
        }
    });

});
