import React from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {waitForElement, fireEvent} from '@testing-library/react';
import {adminProduct} from '../../reducer';
import auth from '../../../Auth/reducer';
import EditProduct from '../../components/Admin/EditProduct';
import NotificationBar from '../../../../components/NotificationBar';
import form from '../../../../reducers/form';
import notification from '../../../../reducers/notification';
import {inputKeys} from '../../config';

const mock = new MockAdapter(axios);
let store;

const productPayload = {
    active: true,
    stock: '1',
    images: [{
        avatar: '5d8fe72d9bb05c03d3b285d8.avatar.jpg?6409f645aab2319a61e4c2d804df484b',
        card: '5d8fe72d9bb05c03d3b285d8.card.jpg?92ae3f09916862bd086608c9a9aa0dfd',
        tile: '5d8fe72d9bb05c03d3b285d8.tile.jpg?10af0eb83db3314260504187215a9d9b',
    }],
    slug: 'optio-sint-eos-veritas',
    description: 'Perspiciatis qui ex',
    longDescription: 'Consequuntur nobis e',
    name: 'Cody Conway',
    unitPrice: '1700',
    weight: '150',
    createdAt: '2019-09-28T23:05:17.426Z',
    updatedAt: '2019-10-14T00:13:38.889Z',
    id: '5d8fe72d9bb05c03d3b285d8',
};

const defaultTestValues = ['foo', 'bar baz foo bar baz', 'baz bar foo baz bar', '2', '2000', '100', true, ''];
const setupFakeInputValues = (store, getByTestId, testValues) => {
    inputKeys.forEach((key, idx) => {
        let requiredInput;
        if (key === 'img') {
            store.dispatch({
                type: '@@redux-form/CHANGE',
                meta: {
                    form: 'product',
                    field: 'img',
                    touch: false,
                    persistentSubmitErrors: false
                },
                payload: {
                    file: {
                        path: 'foo/bar/baz.png'
                    },
                    name: 'baz.png',
                    preview: 'blob:http://localhost:3001/a7240ab5-9c74-4af0-9c01-67cc25969535',
                    size: 6612517
                }
            });
        } else {
            requiredInput = getByTestId(key).getElementsByTagName('input')[0] || getByTestId(key).getElementsByTagName('textarea')[0];
            fireEvent.change(requiredInput, {target: {value: testValues[idx]}});
        }
    });
};

describe('Admin/EditDeliveryMethod', () => {

    beforeEach(() => {
        mock.reset();
        store = createStore(
            combineReducers({
                adminProduct,
                auth,
                form,
                notification,
            }),
            applyMiddleware(thunk),
        );
    });

    it('should render edit-product page', async () => {
        mock.onGet(/.*/).replyOnce(200, {...productPayload, unitPrice: 'foo', description: (new Array(101)).join('too-long')});
        mock.onPut(/admin\/products/).replyOnce(() => {
            socket.socketClient.emit('adminUpdateProduct', {product: productPayload, isActive: true});
            return [200, productPayload];
        });
        const {getByText, getByRole, getByTestId} = await renderWithStore(<><EditProduct match={{params: {productId: productPayload.id}}}/><NotificationBar/></>, store);
        expect(await waitForElement(() => getByText('Edytuj produkt'))).toBeDefined();
        expect(await waitForElement(() => getByText('Zapisz'))).toBeDefined();
        const saveBtn = await waitForElement(() => getByRole('button'));
        expect(saveBtn.disabled).toBe(true);
        setupFakeInputValues(store, getByTestId, defaultTestValues);
        expect(saveBtn.disabled).toBe(false);
        const priceInput = getByTestId('unitPrice').getElementsByTagName('input')[0];
        fireEvent.change(priceInput, {target: {value: ''}});
        fireEvent.blur(priceInput);
        expect(saveBtn.disabled).toBe(true);
        fireEvent.change(priceInput, {target: {value: '.'}});
        fireEvent.blur(priceInput);
        expect(saveBtn.disabled).toBe(true);
        fireEvent.change(priceInput, {target: {value: 'bar.foo'}});
        fireEvent.blur(priceInput);
        expect(saveBtn.disabled).toBe(true);
        fireEvent.change(priceInput, {target: {value: '15'}});
        fireEvent.blur(priceInput);
        expect(saveBtn.disabled).toBe(false);
        fireEvent.change(priceInput, {target: {value: '.15'}});
        fireEvent.blur(priceInput);
        expect(saveBtn.disabled).toBe(false);
        fireEvent.change(priceInput, {target: {value: '.1'}});
        fireEvent.blur(priceInput);
        expect(saveBtn.disabled).toBe(false);
        fireEvent.change(priceInput, {target: {value: '.00'}});
        fireEvent.blur(priceInput);
        fireEvent.change(priceInput, {target: {value: 0}});
        fireEvent.blur(priceInput);
        expect(saveBtn.disabled).toBe(true);
        fireEvent.change(priceInput, {target: {value: '15.'}});
        fireEvent.blur(priceInput);
        expect(saveBtn.disabled).toBe(true);
        fireEvent.change(priceInput, {target: {value: '20.00'}});
        fireEvent.blur(priceInput);
        expect(saveBtn.disabled).toBe(false);
        fireEvent.click(saveBtn);
        expect(await waitForElement(() => getByText(`Produkt ${productPayload.name} został zmieniony.`))).toBeDefined();
    });

    it('should show error message on network error', async () => {
        mock.onGet(/admin\/products/).replyOnce(200, {...productPayload, unitPrice: '34,78,88'});
        mock.onPut(/admin\/products/).networkErrorOnce();
        const {getByText, getByRole, getByTestId} = await renderWithStore(<><EditProduct match={{params: {productId: productPayload.id}}}/><NotificationBar/></>, store);
        const saveBtn = await waitForElement(() => getByRole('button'));
        const unitPriceInput = getByTestId('unitPrice').getElementsByTagName('input')[0];
        fireEvent.focus(unitPriceInput);
        fireEvent.blur(unitPriceInput);
        setupFakeInputValues(store, getByTestId, defaultTestValues);
        fireEvent.click(saveBtn);
        expect(await waitForElement(() => getByText('Network Error'))).toBeDefined();
    });

    it('should show error message on network error when fetching product fails', async () => {
        mock.onGet(/admin\/products/).networkErrorOnce();
        const {getByText} = await renderWithStore(<><EditProduct match={{params: {productId: productPayload.id}}}/><NotificationBar/></>, store);
        expect(await waitForElement(() => getByText('Network Error'))).toBeDefined();
    });

});