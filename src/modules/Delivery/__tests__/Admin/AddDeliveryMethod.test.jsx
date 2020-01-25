import React from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {waitForElement, fireEvent} from '@testing-library/react';
import {adminDeliveryMethod} from '../../reducer';
import auth from '../../../Auth/reducer';
import AddDeliveryMethod from '../../components/Admin/AddDeliveryMethod';
import NotificationBar from '../../../../components/NotificationBar';
import form from '../../../../reducers/form';
import notification from '../../../../reducers/notification';
import {inputKeys} from '../../config';

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

describe('Admin/AddDeliveryMethod', () => {

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

    it('should render add-delivery-method page', async () => {
        mock.onPost(/admin\/delivery-methods/).replyOnce(() => {
            socket.socketClient.emit('adminCreateDelivery', {deliveryMethod: deliveryMethodPayload});
            return [201, deliveryMethodPayload];
        });
        const {getByText, getByRole, getByTestId} = await renderWithStore(<><AddDeliveryMethod/><NotificationBar/></>, store);
        expect(await waitForElement(() => getByText('Dodaj opcję dostawy'))).toBeDefined();
        expect(await waitForElement(() => getByText('Zapisz'))).toBeDefined();
        const saveBtn = await waitForElement(() => getByRole('button'));
        expect(saveBtn.disabled).toBe(true);
        const values = ['foo', '1'];
        inputKeys.forEach((key, idx) => {
            const requiredInput = getByTestId(key).getElementsByTagName('input')[0];
            fireEvent.change(requiredInput, {target: {value: values[idx]}});
        });
        expect(saveBtn.disabled).toBe(false);
        fireEvent.click(saveBtn);
        expect(await waitForElement(() => getByText(`Opcja dostawy ${deliveryMethodPayload.name} została dodana.`))).toBeDefined();
    });

    it('should show error message on network error', async () => {
        mock.onPost(/admin\/delivery-methods/).networkErrorOnce();
        const {getByText, getByRole, getByTestId} = await renderWithStore(<><AddDeliveryMethod/><NotificationBar/></>, store);
        const saveBtn = await waitForElement(() => getByRole('button'));
        const values = ['foo', '1'];
        inputKeys.forEach((key, idx) => {
            const requiredInput = getByTestId(key).getElementsByTagName('input')[0];
            fireEvent.change(requiredInput, {target: {value: values[idx]}});
        });
        fireEvent.click(saveBtn);
        expect(await waitForElement(() => getByText('Network Error'))).toBeDefined();
    });

});