import React from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {waitForElement, fireEvent} from '@testing-library/react';
import {adminDeliveryMethod} from '../../reducer';
import auth from '../../../Auth/reducer';
import EditDeliveryMethod from '../../components/Admin/EditDeliveryMethod';
import NotificationBar from '../../../../components/NotificationBar';
import form from '../../../../reducers/form';
import notification from '../../../../reducers/notification';

const mock = new MockAdapter(axios);
let store;

const deliveryMethodPayload = {
    active: true,
    name: 'Fizz',
    slug: 'fizz',
    unitPrice: '1000',
    createdAt: '2020-01-23T14:45:51.053Z',
    updatedAt: '2020-01-23T14:45:51.053Z',
    id: 'buzz',
};

describe('Admin/EditDeliveryMethod', () => {

    beforeEach(() => {
        fakeLocalStorage();
        mock.reset();
        store = createStore(
            combineReducers({
                adminDeliveryMethod,
                auth,
                form,
                notification,
            }),
            applyMiddleware(thunk),
        );
    });

    describe('fetch delivery method ok', () => {

        beforeEach(() => {
            mock.onGet(/admin\/delivery-methods/).replyOnce(() => {
                return [200, deliveryMethodPayload];
            });
        });

        it('should render edit-delivery-method page', async () => {
            mock.onPut(/admin\/delivery-methods/).replyOnce(() => {
                socket.socketClient.emit('adminUpdateDelivery', {deliveryMethod: deliveryMethodPayload});
                return [200, deliveryMethodPayload];
            });
            const {getByText, getByRole} = await renderWithStore(<><EditDeliveryMethod match={{params: {id: deliveryMethodPayload.id}}}/><NotificationBar/></>, store);
            expect(await waitForElement(() => getByText('Edytuj opcję dostawy'))).toBeDefined();
            expect(await waitForElement(() => getByText('Zapisz'))).toBeDefined();
            const saveBtn = await waitForElement(() => getByRole('button'));
            expect(saveBtn.disabled).toBe(false);
            fireEvent.click(saveBtn);
            expect(await waitForElement(() => getByText(`Opcja dostawy ${deliveryMethodPayload.name} została zmieniona.`))).toBeDefined();
        });

        it('should show error message on network error', async () => {
            mock.onPut(/admin\/delivery-methods/).networkErrorOnce();
            const {getByText, getByRole} = await renderWithStore(<><EditDeliveryMethod match={{params: {id: deliveryMethodPayload.id}}}/><NotificationBar/></>, store);
            const saveBtn = await waitForElement(() => getByRole('button'));
            fireEvent.click(saveBtn);
            expect(await waitForElement(() => getByText('Network Error'))).toBeDefined();
        });

    });

    describe('fetch delivery method fails', () => {

        it('should render error page when loading delivery method fails', async () => {
            mock.onGet(/admin\/delivery-methods/).networkErrorOnce();
            const {getByText} = await renderWithStore(<EditDeliveryMethod match={{params: {id: deliveryMethodPayload.id}}}/>, store);
            expect(await waitForElement(() => getByText('Network Error'))).toBeDefined();
        });

    });

});